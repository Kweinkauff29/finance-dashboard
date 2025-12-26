import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID, getMonthRange } from '../db/types';

export const summaryRoutes = new Hono<{ Bindings: Bindings }>();

// Get complete month summary
summaryRoutes.get('/:year/:month/summary', async (c) => {
    const year = parseInt(c.req.param('year'));
    const month = parseInt(c.req.param('month'));
    const db = c.env.DB;
    const { start, end } = getMonthRange(year, month);

    // Get budgets with category info
    const budgetsResult = await db.prepare(`
    SELECT b.category_id, b.budget_cents,
           c.name as category_name, c.color as category_color, c.sort_order
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    WHERE b.user_id = ? AND b.year = ? AND b.month = ?
    ORDER BY c.sort_order ASC
  `).bind(DEFAULT_USER_ID, year, month).all();

    // Get actuals from transactions
    const transactionActuals = await db.prepare(`
    SELECT category_id, SUM(amount_cents) as actual_cents
    FROM transactions
    WHERE user_id = ? AND date >= ? AND date <= ?
    GROUP BY category_id
  `).bind(DEFAULT_USER_ID, start, end).all();

    // Get actuals from rollups (for months without individual transactions)
    const rollupActuals = await db.prepare(`
    SELECT category_id, actual_cents, label_text
    FROM monthly_rollups
    WHERE user_id = ? AND year = ? AND month = ?
  `).bind(DEFAULT_USER_ID, year, month).all();

    // Create actuals map (prefer transactions over rollups)
    const actualsMap = new Map<number, { actual_cents: number; label_text?: string }>();

    // First add rollups
    for (const row of (rollupActuals.results || []) as any[]) {
        actualsMap.set(row.category_id, {
            actual_cents: row.actual_cents,
            label_text: row.label_text,
        });
    }

    // Then override with transaction actuals if they exist
    for (const row of (transactionActuals.results || []) as any[]) {
        actualsMap.set(row.category_id, {
            actual_cents: row.actual_cents,
        });
    }

    // Build budget health data
    const budgetHealth = (budgetsResult.results || []).map((b: any) => {
        const actual = actualsMap.get(b.category_id) || { actual_cents: 0 };
        const budget_cents = b.budget_cents;
        const actual_cents = actual.actual_cents;
        const variance_cents = budget_cents - actual_cents;
        const percent = budget_cents > 0 ? (actual_cents / budget_cents) * 100 : 0;

        let status: 'good' | 'warning' | 'over' = 'good';
        if (percent >= 100) status = 'over';
        else if (percent >= 80) status = 'warning';

        return {
            category_id: b.category_id,
            category_name: b.category_name,
            category_color: b.category_color,
            budget_cents,
            actual_cents,
            variance_cents,
            percent: Math.round(percent * 10) / 10,
            status,
            label_text: actual.label_text,
        };
    });

    // Calculate totals
    const totalBudget = budgetHealth.reduce((sum, b) => sum + b.budget_cents, 0);
    const totalActual = budgetHealth.reduce((sum, b) => sum + b.actual_cents, 0);
    const remaining = totalBudget - totalActual;

    // Get income for this month
    const incomeResult = await db.prepare(`
    SELECT SUM(CASE WHEN type = 'base' THEN amount_cents ELSE 0 END) as base_income,
           SUM(CASE WHEN type = 'bonus' THEN amount_cents ELSE 0 END) as bonus_income
    FROM income_events
    WHERE user_id = ? AND date >= ? AND date <= ?
  `).bind(DEFAULT_USER_ID, start, end).first<{ base_income: number; bonus_income: number }>();

    // Get top 5 merchants
    const merchantsResult = await db.prepare(`
    SELECT merchant, SUM(amount_cents) as total_cents, COUNT(*) as transaction_count
    FROM transactions
    WHERE user_id = ? AND date >= ? AND date <= ? AND merchant IS NOT NULL
    GROUP BY merchant
    ORDER BY total_cents DESC
    LIMIT 5
  `).bind(DEFAULT_USER_ID, start, end).all();

    // Get daily totals for trend chart
    const dailyTotals = await db.prepare(`
    SELECT date, SUM(amount_cents) as total_cents
    FROM transactions
    WHERE user_id = ? AND date >= ? AND date <= ?
    GROUP BY date
    ORDER BY date ASC
  `).bind(DEFAULT_USER_ID, start, end).all();

    return c.json({
        year,
        month,
        income: {
            base_cents: incomeResult?.base_income || 0,
            bonus_cents: incomeResult?.bonus_income || 0,
        },
        totals: {
            budget_cents: totalBudget,
            actual_cents: totalActual,
            remaining_cents: remaining,
        },
        budget_health: budgetHealth,
        top_merchants: merchantsResult.results || [],
        daily_totals: dailyTotals.results || [],
    });
});
