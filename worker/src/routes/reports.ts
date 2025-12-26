import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID, getMonthRange } from '../db/types';

export const reportsRoutes = new Hono<{ Bindings: Bindings }>();

// Get yearly report data
reportsRoutes.get('/yearly/:year', async (c) => {
  const year = parseInt(c.req.param('year'));
  const db = c.env.DB;

  // Get monthly totals by category
  const monthlyByCategory = await db.prepare(`
    WITH monthly_transactions AS (
      SELECT 
        CAST(strftime('%m', date) AS INTEGER) as month,
        category_id,
        SUM(amount_cents) as actual_cents
      FROM transactions
      WHERE user_id = ? AND strftime('%Y', date) = ?
      GROUP BY month, category_id
    ),
    rollups AS (
      SELECT month, category_id, actual_cents
      FROM monthly_rollups
      WHERE user_id = ? AND year = ?
    ),
    combined AS (
      SELECT * FROM monthly_transactions
      UNION ALL
      SELECT * FROM rollups
    )
    SELECT 
      c.id as category_id,
      c.name as category_name,
      c.color as category_color,
      m.month,
      m.actual_cents
    FROM combined m
    JOIN categories c ON m.category_id = c.id
    ORDER BY c.sort_order, m.month
  `).bind(DEFAULT_USER_ID, String(year), DEFAULT_USER_ID, year).all();

  // Get budget vs actual by month
  const budgetVsActual = await db.prepare(`
    WITH monthly_budgets AS (
      SELECT month, SUM(budget_cents) as total_budget
      FROM budgets
      WHERE user_id = ? AND year = ?
      GROUP BY month
    ),
    monthly_actuals_tx AS (
      SELECT 
        CAST(strftime('%m', date) AS INTEGER) as month,
        SUM(amount_cents) as actual_cents
      FROM transactions
      WHERE user_id = ? AND strftime('%Y', date) = ?
      GROUP BY month
    ),
    monthly_actuals_rollup AS (
      SELECT month, SUM(actual_cents) as actual_cents
      FROM monthly_rollups
      WHERE user_id = ? AND year = ?
      GROUP BY month
    ),
    combined_actuals AS (
      SELECT month, SUM(actual_cents) as total_actual
      FROM (
        SELECT * FROM monthly_actuals_tx
        UNION ALL
        SELECT * FROM monthly_actuals_rollup
      )
      GROUP BY month
    )
    SELECT 
      b.month,
      b.total_budget as budget_cents,
      COALESCE(a.total_actual, 0) as actual_cents,
      b.total_budget - COALESCE(a.total_actual, 0) as variance_cents
    FROM monthly_budgets b
    LEFT JOIN combined_actuals a ON b.month = a.month
    ORDER BY b.month
  `).bind(DEFAULT_USER_ID, year, DEFAULT_USER_ID, String(year), DEFAULT_USER_ID, year).all();

  // Get most over-budget categories
  const overBudgetLeaders = await db.prepare(`
    WITH category_variance AS (
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.color as category_color,
        SUM(b.budget_cents) as total_budget,
        COALESCE(SUM(
          CASE 
            WHEN t.actual_cents IS NOT NULL THEN t.actual_cents
            WHEN r.actual_cents IS NOT NULL THEN r.actual_cents
            ELSE 0
          END
        ), 0) as total_actual
      FROM categories c
      LEFT JOIN budgets b ON c.id = b.category_id AND b.user_id = ? AND b.year = ?
      LEFT JOIN (
        SELECT category_id, CAST(strftime('%m', date) AS INTEGER) as month, SUM(amount_cents) as actual_cents
        FROM transactions
        WHERE user_id = ? AND strftime('%Y', date) = ?
        GROUP BY category_id, month
      ) t ON c.id = t.category_id AND b.month = t.month
      LEFT JOIN monthly_rollups r ON c.id = r.category_id AND r.user_id = ? AND r.year = ? AND b.month = r.month
      GROUP BY c.id
    )
    SELECT 
      category_id,
      category_name,
      category_color,
      total_budget,
      total_actual,
      total_actual - total_budget as overage_cents
    FROM category_variance
    WHERE total_actual > total_budget
    ORDER BY overage_cents DESC
    LIMIT 5
  `).bind(DEFAULT_USER_ID, year, DEFAULT_USER_ID, String(year), DEFAULT_USER_ID, year).all();

  // Get category totals for the year
  const categoryTotals = await db.prepare(`
    WITH tx_totals AS (
      SELECT category_id, SUM(amount_cents) as total_cents
      FROM transactions
      WHERE user_id = ? AND strftime('%Y', date) = ?
      GROUP BY category_id
    ),
    rollup_totals AS (
      SELECT category_id, SUM(actual_cents) as total_cents
      FROM monthly_rollups
      WHERE user_id = ? AND year = ?
      GROUP BY category_id
    ),
    combined AS (
      SELECT category_id, SUM(total_cents) as total_cents
      FROM (
        SELECT * FROM tx_totals
        UNION ALL
        SELECT * FROM rollup_totals
      )
      GROUP BY category_id
    )
    SELECT 
      c.id as category_id,
      c.name as category_name,
      c.color as category_color,
      combined.total_cents
    FROM combined
    JOIN categories c ON combined.category_id = c.id
    WHERE combined.total_cents > 0
    ORDER BY combined.total_cents DESC
  `).bind(DEFAULT_USER_ID, String(year), DEFAULT_USER_ID, year).all();

  // Build monthly totals for stacked chart
  const monthlyTotals: Record<number, Record<string, number>> = {};
  for (let m = 1; m <= 12; m++) {
    monthlyTotals[m] = {};
  }

  for (const row of (monthlyByCategory.results || []) as any[]) {
    if (!monthlyTotals[row.month]) {
      monthlyTotals[row.month] = {};
    }
    monthlyTotals[row.month][row.category_name] = row.actual_cents;
  }

  return c.json({
    year,
    monthly_by_category: monthlyByCategory.results || [],
    monthly_totals: monthlyTotals,
    budget_vs_actual: budgetVsActual.results || [],
    over_budget_leaders: overBudgetLeaders.results || [],
    category_totals: categoryTotals.results || [],
  });
});

// Export transactions as CSV
reportsRoutes.get('/export/csv', async (c) => {
  const db = c.env.DB;
  const year = c.req.query('year');
  const month = c.req.query('month');

  let sql = `
    SELECT t.date, t.amount_cents, t.merchant, c.name as category, t.note
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `;
  const params: (string | number)[] = [DEFAULT_USER_ID];

  if (year) {
    sql += ` AND strftime('%Y', t.date) = ?`;
    params.push(year);
  }
  if (month) {
    sql += ` AND strftime('%m', t.date) = ?`;
    params.push(month.padStart(2, '0'));
  }

  sql += ` ORDER BY t.date ASC`;

  const result = await db.prepare(sql).bind(...params).all();

  // Build CSV
  const rows = (result.results || []) as any[];
  const header = 'Date,Amount,Merchant,Category,Note';
  const csvRows = rows.map(row => {
    const amount = (row.amount_cents / 100).toFixed(2);
    const merchant = `"${(row.merchant || '').replace(/"/g, '""')}"`;
    const note = `"${(row.note || '').replace(/"/g, '""')}"`;
    return `${row.date},${amount},${merchant},${row.category},${note}`;
  });

  const csv = [header, ...csvRows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="transactions${year ? `-${year}` : ''}${month ? `-${month}` : ''}.csv"`,
    },
  });
});
