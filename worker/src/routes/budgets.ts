import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID, type Budget } from '../db/types';

export const budgetsRoutes = new Hono<{ Bindings: Bindings }>();

// Get budgets for a month
budgetsRoutes.get('/:year/:month', async (c) => {
    const year = parseInt(c.req.param('year'));
    const month = parseInt(c.req.param('month'));
    const db = c.env.DB;

    const result = await db.prepare(`
    SELECT b.id, b.user_id, b.year, b.month, b.category_id, b.budget_cents,
           c.name as category_name, c.color as category_color
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    WHERE b.user_id = ? AND b.year = ? AND b.month = ?
    ORDER BY c.sort_order ASC
  `).bind(DEFAULT_USER_ID, year, month).all();

    return c.json({
        year,
        month,
        budgets: result.results || [],
    });
});

// Update budgets for a month (bulk update)
budgetsRoutes.put('/:year/:month', async (c) => {
    const year = parseInt(c.req.param('year'));
    const month = parseInt(c.req.param('month'));
    const db = c.env.DB;
    const body = await c.req.json<{
        budgets: Array<{
            category_id: number;
            budget_cents: number;
        }>;
    }>();

    if (!body.budgets || !Array.isArray(body.budgets)) {
        return c.json({ error: 'Budgets array is required' }, 400);
    }

    // Use upsert for each budget
    const statements = body.budgets.map((b) =>
        db.prepare(`
      INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (user_id, year, month, category_id)
      DO UPDATE SET budget_cents = excluded.budget_cents
    `).bind(DEFAULT_USER_ID, year, month, b.category_id, b.budget_cents)
    );

    await db.batch(statements);

    return c.json({ success: true });
});

// Copy budgets from previous month
budgetsRoutes.post('/:year/:month/copy', async (c) => {
    const year = parseInt(c.req.param('year'));
    const month = parseInt(c.req.param('month'));
    const db = c.env.DB;

    // Calculate previous month
    let prevYear = year;
    let prevMonth = month - 1;
    if (prevMonth < 1) {
        prevMonth = 12;
        prevYear = year - 1;
    }

    // Get previous month's budgets
    const prevBudgets = await db.prepare(`
    SELECT category_id, budget_cents
    FROM budgets
    WHERE user_id = ? AND year = ? AND month = ?
  `).bind(DEFAULT_USER_ID, prevYear, prevMonth).all<{ category_id: number; budget_cents: number }>();

    if (!prevBudgets.results || prevBudgets.results.length === 0) {
        return c.json({ error: 'No budgets found for previous month' }, 404);
    }

    // Insert/update budgets for current month
    const statements = prevBudgets.results.map((b) =>
        db.prepare(`
      INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (user_id, year, month, category_id)
      DO UPDATE SET budget_cents = excluded.budget_cents
    `).bind(DEFAULT_USER_ID, year, month, b.category_id, b.budget_cents)
    );

    await db.batch(statements);

    return c.json({
        success: true,
        copied: prevBudgets.results.length,
        from: { year: prevYear, month: prevMonth },
    });
});

// Get rebalance suggestions based on historical overages
budgetsRoutes.get('/rebalance', async (c) => {
    const db = c.env.DB;

    // Get categories that went over budget in recent months
    const overages = await db.prepare(`
    WITH monthly_actuals AS (
      SELECT 
        strftime('%Y', date) as year,
        strftime('%m', date) as month,
        category_id,
        SUM(amount_cents) as actual_cents
      FROM transactions
      WHERE user_id = ?
      GROUP BY year, month, category_id
    ),
    combined AS (
      SELECT year, month, category_id, actual_cents FROM monthly_actuals
      UNION ALL
      SELECT CAST(year AS TEXT), printf('%02d', month), category_id, actual_cents 
      FROM monthly_rollups WHERE user_id = ?
    ),
    variance AS (
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.color as category_color,
        b.budget_cents,
        a.actual_cents,
        (a.actual_cents - b.budget_cents) as overage_cents,
        a.year,
        a.month
      FROM combined a
      JOIN budgets b ON CAST(a.year AS INTEGER) = b.year 
        AND CAST(a.month AS INTEGER) = b.month 
        AND a.category_id = b.category_id
        AND b.user_id = ?
      JOIN categories c ON a.category_id = c.id
      WHERE a.actual_cents > b.budget_cents
    )
    SELECT 
      category_id,
      category_name,
      category_color,
      COUNT(*) as times_over,
      AVG(overage_cents) as avg_overage_cents,
      MAX(overage_cents) as max_overage_cents
    FROM variance
    GROUP BY category_id
    ORDER BY times_over DESC, avg_overage_cents DESC
    LIMIT 10
  `).bind(DEFAULT_USER_ID, DEFAULT_USER_ID, DEFAULT_USER_ID).all();

    return c.json({
        suggestions: (overages.results || []).map((row: any) => ({
            category_id: row.category_id,
            category_name: row.category_name,
            category_color: row.category_color,
            times_over: row.times_over,
            avg_overage_cents: Math.round(row.avg_overage_cents),
            max_overage_cents: row.max_overage_cents,
            suggested_increase_cents: Math.round(row.avg_overage_cents * 1.1), // 10% buffer
        })),
    });
});
