import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID } from '../db/types';

export const transfersRoutes = new Hono<{ Bindings: Bindings }>();

// Get all transfers
transfersRoutes.get('/', async (c) => {
    const db = c.env.DB;
    const year = c.req.query('year');
    const month = c.req.query('month');

    let sql = `
    SELECT id, date, from_bucket, to_bucket, amount_cents, note, created_at
    FROM transfers
    WHERE user_id = ?
  `;
    const params: (string | number)[] = [DEFAULT_USER_ID];

    if (year) {
        sql += ` AND strftime('%Y', date) = ?`;
        params.push(year);
    }
    if (month) {
        sql += ` AND strftime('%m', date) = ?`;
        params.push(month.padStart(2, '0'));
    }

    sql += ` ORDER BY date DESC, created_at DESC`;

    const result = await db.prepare(sql).bind(...params).all();

    return c.json({
        transfers: result.results || [],
    });
});

// Create transfer
transfersRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json<{
        date: string;
        from_bucket: string;
        to_bucket: string;
        amount_cents: number;
        note?: string;
    }>();

    if (!body.date || !body.from_bucket || !body.to_bucket || !body.amount_cents) {
        return c.json({ error: 'date, from_bucket, to_bucket, and amount_cents are required' }, 400);
    }

    // If transferring from a goal, update the goal balance
    if (body.from_bucket.startsWith('goal:')) {
        const goalId = parseInt(body.from_bucket.split(':')[1]);
        await db.prepare(`
      UPDATE goals SET current_cents = current_cents - ? WHERE id = ? AND user_id = ?
    `).bind(body.amount_cents, goalId, DEFAULT_USER_ID).run();
    }

    // If transferring to a goal, update the goal balance
    if (body.to_bucket.startsWith('goal:')) {
        const goalId = parseInt(body.to_bucket.split(':')[1]);
        await db.prepare(`
      UPDATE goals SET current_cents = current_cents + ? WHERE id = ? AND user_id = ?
    `).bind(body.amount_cents, goalId, DEFAULT_USER_ID).run();
    }

    const result = await db.prepare(`
    INSERT INTO transfers (user_id, date, from_bucket, to_bucket, amount_cents, note)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id
  `).bind(
        DEFAULT_USER_ID,
        body.date,
        body.from_bucket,
        body.to_bucket,
        body.amount_cents,
        body.note || null
    ).first<{ id: number }>();

    return c.json({
        success: true,
        id: result?.id,
    }, 201);
});

// Delete transfer (and reverse the balance changes)
transfersRoutes.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    // Get the transfer first
    const transfer = await db.prepare(`
    SELECT * FROM transfers WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).first<{
        from_bucket: string;
        to_bucket: string;
        amount_cents: number;
    }>();

    if (!transfer) {
        return c.json({ error: 'Transfer not found' }, 404);
    }

    // Reverse goal balance changes
    if (transfer.from_bucket.startsWith('goal:')) {
        const goalId = parseInt(transfer.from_bucket.split(':')[1]);
        await db.prepare(`
      UPDATE goals SET current_cents = current_cents + ? WHERE id = ? AND user_id = ?
    `).bind(transfer.amount_cents, goalId, DEFAULT_USER_ID).run();
    }

    if (transfer.to_bucket.startsWith('goal:')) {
        const goalId = parseInt(transfer.to_bucket.split(':')[1]);
        await db.prepare(`
      UPDATE goals SET current_cents = current_cents - ? WHERE id = ? AND user_id = ?
    `).bind(transfer.amount_cents, goalId, DEFAULT_USER_ID).run();
    }

    // Delete the transfer
    await db.prepare(`
    DELETE FROM transfers WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).run();

    return c.json({ success: true });
});
