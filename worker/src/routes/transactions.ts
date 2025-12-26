import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID, type Transaction } from '../db/types';

export const transactionsRoutes = new Hono<{ Bindings: Bindings }>();

// Get merchant autocomplete suggestions - must be before /:id routes
transactionsRoutes.get('/merchants/autocomplete', async (c) => {
    const db = c.env.DB;
    const query = c.req.query('q') || '';

    const result = await db.prepare(`
    SELECT DISTINCT merchant, COUNT(*) as count
    FROM transactions
    WHERE user_id = ? AND merchant LIKE ? AND merchant IS NOT NULL
    GROUP BY merchant
    ORDER BY count DESC
    LIMIT 10
  `).bind(DEFAULT_USER_ID, `%${query}%`).all();

    return c.json({
        merchants: (result.results || []).map((r: any) => r.merchant),
    });
});

// List transactions with search and filters
transactionsRoutes.get('/', async (c) => {
    const db = c.env.DB;
    const query = c.req.query();

    let sql = `
    SELECT t.id, t.user_id, t.date, t.amount_cents, t.merchant, t.category_id, t.note, t.created_at,
           c.name as category_name, c.color as category_color
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `;
    const params: (string | number)[] = [DEFAULT_USER_ID];

    // Search by merchant or note
    if (query.search) {
        sql += ` AND (t.merchant LIKE ? OR t.note LIKE ?)`;
        params.push(`%${query.search}%`, `%${query.search}%`);
    }

    // Filter by category
    if (query.category_id) {
        sql += ` AND t.category_id = ?`;
        params.push(parseInt(query.category_id));
    }

    // Filter by date range
    if (query.start_date) {
        sql += ` AND t.date >= ?`;
        params.push(query.start_date);
    }
    if (query.end_date) {
        sql += ` AND t.date <= ?`;
        params.push(query.end_date);
    }

    // Filter by amount range (in cents)
    if (query.min_amount) {
        sql += ` AND t.amount_cents >= ?`;
        params.push(parseInt(query.min_amount));
    }
    if (query.max_amount) {
        sql += ` AND t.amount_cents <= ?`;
        params.push(parseInt(query.max_amount));
    }

    // Order by date descending
    sql += ` ORDER BY t.date DESC, t.created_at DESC`;

    // Pagination
    const limit = parseInt(query.limit || '50');
    const offset = parseInt(query.offset || '0');
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const result = await db.prepare(sql).bind(...params).all();

    return c.json({
        transactions: result.results || [],
        limit,
        offset,
    });
});

// Get single transaction
transactionsRoutes.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    const result = await db.prepare(`
    SELECT t.*, c.name as category_name, c.color as category_color
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.id = ? AND t.user_id = ?
  `).bind(id, DEFAULT_USER_ID).first();

    if (!result) {
        return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json({ transaction: result });
});

// Create transaction
transactionsRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json<{
        date: string;
        amount_cents: number;
        merchant?: string;
        category_id: number;
        note?: string;
    }>();

    if (!body.date || !body.amount_cents || !body.category_id) {
        return c.json({ error: 'date, amount_cents, and category_id are required' }, 400);
    }

    const result = await db.prepare(`
    INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id
  `).bind(
        DEFAULT_USER_ID,
        body.date,
        body.amount_cents,
        body.merchant || null,
        body.category_id,
        body.note || null
    ).first<{ id: number }>();

    return c.json({
        success: true,
        id: result?.id,
    }, 201);
});

// Update transaction
transactionsRoutes.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;
    const body = await c.req.json<{
        date?: string;
        amount_cents?: number;
        merchant?: string;
        category_id?: number;
        note?: string;
    }>();

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.date !== undefined) {
        updates.push('date = ?');
        values.push(body.date);
    }
    if (body.amount_cents !== undefined) {
        updates.push('amount_cents = ?');
        values.push(body.amount_cents);
    }
    if (body.merchant !== undefined) {
        updates.push('merchant = ?');
        values.push(body.merchant || null);
    }
    if (body.category_id !== undefined) {
        updates.push('category_id = ?');
        values.push(body.category_id);
    }
    if (body.note !== undefined) {
        updates.push('note = ?');
        values.push(body.note || null);
    }

    if (updates.length === 0) {
        return c.json({ error: 'No fields to update' }, 400);
    }

    values.push(id, DEFAULT_USER_ID);

    await db.prepare(`
    UPDATE transactions
    SET ${updates.join(', ')}
    WHERE id = ? AND user_id = ?
  `).bind(...values).run();

    return c.json({ success: true });
});

// Delete transaction
transactionsRoutes.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    await db.prepare(`
    DELETE FROM transactions WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).run();

    return c.json({ success: true });
});

// Duplicate transaction
transactionsRoutes.post('/:id/duplicate', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;
    const body = await c.req.json<{ date?: string }>();

    // Get original transaction
    const original = await db.prepare(`
    SELECT * FROM transactions WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).first<Transaction>();

    if (!original) {
        return c.json({ error: 'Transaction not found' }, 404);
    }

    // Create duplicate with optional new date
    const newDate = body.date || original.date;

    const result = await db.prepare(`
    INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id
  `).bind(
        DEFAULT_USER_ID,
        newDate,
        original.amount_cents,
        original.merchant,
        original.category_id,
        original.note
    ).first<{ id: number }>();

    return c.json({
        success: true,
        id: result?.id,
    }, 201);
});
