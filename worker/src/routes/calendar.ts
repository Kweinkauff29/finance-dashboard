import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID } from '../db/types';

export const calendarRoutes = new Hono<{ Bindings: Bindings }>();

// Get calendar data for a date range
calendarRoutes.get('/', async (c) => {
    const db = c.env.DB;
    const startDate = c.req.query('start');
    const endDate = c.req.query('end');
    const categoryId = c.req.query('category_id');

    if (!startDate || !endDate) {
        return c.json({ error: 'start and end query parameters are required' }, 400);
    }

    // Get daily totals
    let dailySql = `
    SELECT date, SUM(amount_cents) as total_cents, COUNT(*) as transaction_count
    FROM transactions
    WHERE user_id = ? AND date >= ? AND date <= ?
  `;
    const dailyParams: (string | number)[] = [DEFAULT_USER_ID, startDate, endDate];

    if (categoryId) {
        dailySql += ` AND category_id = ?`;
        dailyParams.push(parseInt(categoryId));
    }

    dailySql += ` GROUP BY date ORDER BY date ASC`;

    const dailyTotals = await db.prepare(dailySql).bind(...dailyParams).all();

    // Get transactions for the range
    let txSql = `
    SELECT t.id, t.date, t.amount_cents, t.merchant, t.category_id, t.note,
           c.name as category_name, c.color as category_color
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.date >= ? AND t.date <= ?
  `;
    const txParams: (string | number)[] = [DEFAULT_USER_ID, startDate, endDate];

    if (categoryId) {
        txSql += ` AND t.category_id = ?`;
        txParams.push(parseInt(categoryId));
    }

    txSql += ` ORDER BY t.date DESC, t.created_at DESC`;

    const transactions = await db.prepare(txSql).bind(...txParams).all();

    // Get paycheck dates in this range
    const paychecks = await db.prepare(`
    SELECT date, amount_cents, type, note
    FROM income_events
    WHERE user_id = ? AND date >= ? AND date <= ?
    ORDER BY date ASC
  `).bind(DEFAULT_USER_ID, startDate, endDate).all();

    // Group transactions by date
    const transactionsByDate: Record<string, any[]> = {};
    for (const tx of (transactions.results || []) as any[]) {
        if (!transactionsByDate[tx.date]) {
            transactionsByDate[tx.date] = [];
        }
        transactionsByDate[tx.date].push(tx);
    }

    // Create calendar data structure
    const calendarDays: Record<string, {
        date: string;
        total_cents: number;
        transaction_count: number;
        has_paycheck: boolean;
        paycheck_type?: 'base' | 'bonus';
    }> = {};

    // Initialize with daily totals
    for (const day of (dailyTotals.results || []) as any[]) {
        calendarDays[day.date] = {
            date: day.date,
            total_cents: day.total_cents,
            transaction_count: day.transaction_count,
            has_paycheck: false,
        };
    }

    // Add paycheck info
    for (const paycheck of (paychecks.results || []) as any[]) {
        if (!calendarDays[paycheck.date]) {
            calendarDays[paycheck.date] = {
                date: paycheck.date,
                total_cents: 0,
                transaction_count: 0,
                has_paycheck: true,
                paycheck_type: paycheck.type,
            };
        } else {
            calendarDays[paycheck.date].has_paycheck = true;
            calendarDays[paycheck.date].paycheck_type = paycheck.type;
        }
    }

    // Calculate heat intensity (for coloring)
    const totals = Object.values(calendarDays).map(d => d.total_cents);
    const maxSpend = Math.max(...totals, 1);

    const calendarData = Object.values(calendarDays).map(day => ({
        ...day,
        heat_intensity: Math.round((day.total_cents / maxSpend) * 100),
    }));

    return c.json({
        start: startDate,
        end: endDate,
        calendar: calendarData.sort((a, b) => a.date.localeCompare(b.date)),
        transactions_by_date: transactionsByDate,
        paychecks: paychecks.results || [],
    });
});

// Get details for a specific day
calendarRoutes.get('/day/:date', async (c) => {
    const date = c.req.param('date');
    const db = c.env.DB;

    // Get transactions for this day
    const transactions = await db.prepare(`
    SELECT t.id, t.date, t.amount_cents, t.merchant, t.category_id, t.note,
           c.name as category_name, c.color as category_color
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.date = ?
    ORDER BY t.created_at DESC
  `).bind(DEFAULT_USER_ID, date).all();

    // Get total for the day
    const total = (transactions.results || []).reduce(
        (sum: number, tx: any) => sum + tx.amount_cents,
        0
    );

    // Check for paycheck on this day
    const paycheck = await db.prepare(`
    SELECT * FROM income_events
    WHERE user_id = ? AND date = ?
  `).bind(DEFAULT_USER_ID, date).first();

    return c.json({
        date,
        total_cents: total,
        transaction_count: (transactions.results || []).length,
        transactions: transactions.results || [],
        paycheck: paycheck || null,
    });
});
