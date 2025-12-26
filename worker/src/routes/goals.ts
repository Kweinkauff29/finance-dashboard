import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID, type Goal } from '../db/types';

export const goalsRoutes = new Hono<{ Bindings: Bindings }>();

// Get all goals
goalsRoutes.get('/', async (c) => {
    const db = c.env.DB;

    const result = await db.prepare(`
    SELECT id, name, target_cents, current_cents, start_date, end_date, is_rainy_day, created_at
    FROM goals
    WHERE user_id = ?
    ORDER BY is_rainy_day DESC, created_at ASC
  `).bind(DEFAULT_USER_ID).all();

    // Calculate progress for each goal
    const goals = (result.results || []).map((g: any) => ({
        ...g,
        progress_percent: g.target_cents > 0
            ? Math.round((g.current_cents / g.target_cents) * 1000) / 10
            : 0,
        remaining_cents: g.target_cents - g.current_cents,
    }));

    return c.json({ goals });
});

// Get single goal
goalsRoutes.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    const goal = await db.prepare(`
    SELECT * FROM goals WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).first<Goal>();

    if (!goal) {
        return c.json({ error: 'Goal not found' }, 404);
    }

    // Get contribution history (transfers to this goal)
    const contributions = await db.prepare(`
    SELECT date, amount_cents, note, created_at
    FROM transfers
    WHERE user_id = ? AND to_bucket = ?
    ORDER BY date DESC
    LIMIT 20
  `).bind(DEFAULT_USER_ID, `goal:${id}`).all();

    // Get withdrawal history (transfers from this goal)
    const withdrawals = await db.prepare(`
    SELECT date, amount_cents, note, created_at
    FROM transfers
    WHERE user_id = ? AND from_bucket = ?
    ORDER BY date DESC
    LIMIT 20
  `).bind(DEFAULT_USER_ID, `goal:${id}`).all();

    return c.json({
        goal: {
            ...goal,
            progress_percent: goal.target_cents > 0
                ? Math.round((goal.current_cents / goal.target_cents) * 1000) / 10
                : 0,
            remaining_cents: goal.target_cents - goal.current_cents,
        },
        contributions: contributions.results || [],
        withdrawals: withdrawals.results || [],
    });
});

// Create goal
goalsRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json<{
        name: string;
        target_cents: number;
        current_cents?: number;
        start_date?: string;
        end_date?: string;
    }>();

    if (!body.name || !body.target_cents) {
        return c.json({ error: 'name and target_cents are required' }, 400);
    }

    const result = await db.prepare(`
    INSERT INTO goals (user_id, name, target_cents, current_cents, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id
  `).bind(
        DEFAULT_USER_ID,
        body.name,
        body.target_cents,
        body.current_cents || 0,
        body.start_date || null,
        body.end_date || null
    ).first<{ id: number }>();

    return c.json({
        success: true,
        id: result?.id,
    }, 201);
});

// Update goal
goalsRoutes.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;
    const body = await c.req.json<{
        name?: string;
        target_cents?: number;
        current_cents?: number;
        start_date?: string;
        end_date?: string;
    }>();

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.name !== undefined) {
        updates.push('name = ?');
        values.push(body.name);
    }
    if (body.target_cents !== undefined) {
        updates.push('target_cents = ?');
        values.push(body.target_cents);
    }
    if (body.current_cents !== undefined) {
        updates.push('current_cents = ?');
        values.push(body.current_cents);
    }
    if (body.start_date !== undefined) {
        updates.push('start_date = ?');
        values.push(body.start_date || null);
    }
    if (body.end_date !== undefined) {
        updates.push('end_date = ?');
        values.push(body.end_date || null);
    }

    if (updates.length === 0) {
        return c.json({ error: 'No fields to update' }, 400);
    }

    values.push(id, DEFAULT_USER_ID);

    await db.prepare(`
    UPDATE goals
    SET ${updates.join(', ')}
    WHERE id = ? AND user_id = ?
  `).bind(...values).run();

    return c.json({ success: true });
});

// Contribute to a goal
goalsRoutes.post('/:id/contribute', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;
    const body = await c.req.json<{
        amount_cents: number;
        date?: string;
        note?: string;
    }>();

    if (!body.amount_cents) {
        return c.json({ error: 'amount_cents is required' }, 400);
    }

    const date = body.date || new Date().toISOString().split('T')[0];

    // Update goal balance
    await db.prepare(`
    UPDATE goals
    SET current_cents = current_cents + ?
    WHERE id = ? AND user_id = ?
  `).bind(body.amount_cents, id, DEFAULT_USER_ID).run();

    // Record the transfer
    await db.prepare(`
    INSERT INTO transfers (user_id, date, from_bucket, to_bucket, amount_cents, note)
    VALUES (?, ?, 'income', ?, ?, ?)
  `).bind(
        DEFAULT_USER_ID,
        date,
        `goal:${id}`,
        body.amount_cents,
        body.note || null
    ).run();

    return c.json({ success: true });
});

// Withdraw from a goal (for covering overages)
goalsRoutes.post('/:id/withdraw', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;
    const body = await c.req.json<{
        amount_cents: number;
        date?: string;
        note?: string;
    }>();

    if (!body.amount_cents) {
        return c.json({ error: 'amount_cents is required' }, 400);
    }

    const date = body.date || new Date().toISOString().split('T')[0];

    // Check if goal has enough balance
    const goal = await db.prepare(`
    SELECT current_cents FROM goals WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).first<{ current_cents: number }>();

    if (!goal || goal.current_cents < body.amount_cents) {
        return c.json({ error: 'Insufficient balance in goal' }, 400);
    }

    // Update goal balance
    await db.prepare(`
    UPDATE goals
    SET current_cents = current_cents - ?
    WHERE id = ? AND user_id = ?
  `).bind(body.amount_cents, id, DEFAULT_USER_ID).run();

    // Record the transfer
    await db.prepare(`
    INSERT INTO transfers (user_id, date, from_bucket, to_bucket, amount_cents, note)
    VALUES (?, ?, ?, 'spending', ?, ?)
  `).bind(
        DEFAULT_USER_ID,
        date,
        `goal:${id}`,
        body.amount_cents,
        body.note || 'Cover budget overage'
    ).run();

    return c.json({ success: true });
});

// Delete goal
goalsRoutes.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    await db.prepare(`
    DELETE FROM goals WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).run();

    return c.json({ success: true });
});
