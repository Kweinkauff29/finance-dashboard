import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID } from '../db/types';

export const incomeRoutes = new Hono<{ Bindings: Bindings }>();

// Get all income events
incomeRoutes.get('/', async (c) => {
    const db = c.env.DB;
    const year = c.req.query('year');

    let sql = `
    SELECT id, date, amount_cents, type, note
    FROM income_events
    WHERE user_id = ?
  `;
    const params: (string | number)[] = [DEFAULT_USER_ID];

    if (year) {
        sql += ` AND strftime('%Y', date) = ?`;
        params.push(year);
    }

    sql += ` ORDER BY date ASC`;

    const result = await db.prepare(sql).bind(...params).all();

    // Calculate totals
    let baseTotal = 0;
    let bonusTotal = 0;
    for (const event of (result.results || []) as any[]) {
        if (event.type === 'base') {
            baseTotal += event.amount_cents;
        } else {
            bonusTotal += event.amount_cents;
        }
    }

    return c.json({
        income_events: result.results || [],
        totals: {
            base_cents: baseTotal,
            bonus_cents: bonusTotal,
            total_cents: baseTotal + bonusTotal,
        },
    });
});

// Create income event
incomeRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json<{
        date: string;
        amount_cents: number;
        type: 'base' | 'bonus';
        note?: string;
    }>();

    if (!body.date || !body.amount_cents || !body.type) {
        return c.json({ error: 'date, amount_cents, and type are required' }, 400);
    }

    const result = await db.prepare(`
    INSERT INTO income_events (user_id, date, amount_cents, type, note)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id
  `).bind(
        DEFAULT_USER_ID,
        body.date,
        body.amount_cents,
        body.type,
        body.note || null
    ).first<{ id: number }>();

    // If it's a bonus paycheck, auto-deposit to rainy day fund
    if (body.type === 'bonus') {
        // Find rainy day goal
        const rainyDay = await db.prepare(`
      SELECT id FROM goals WHERE user_id = ? AND is_rainy_day = 1
    `).bind(DEFAULT_USER_ID).first<{ id: number }>();

        if (rainyDay) {
            // Update goal
            await db.prepare(`
        UPDATE goals SET current_cents = current_cents + ? WHERE id = ?
      `).bind(body.amount_cents, rainyDay.id).run();

            // Record transfer
            await db.prepare(`
        INSERT INTO transfers (user_id, date, from_bucket, to_bucket, amount_cents, note)
        VALUES (?, ?, 'bonus_paycheck', ?, ?, ?)
      `).bind(
                DEFAULT_USER_ID,
                body.date,
                `goal:${rainyDay.id}`,
                body.amount_cents,
                'Auto-deposit from bonus paycheck'
            ).run();
        }
    }

    return c.json({
        success: true,
        id: result?.id,
    }, 201);
});

// Update income event
incomeRoutes.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;
    const body = await c.req.json<{
        date?: string;
        amount_cents?: number;
        type?: 'base' | 'bonus';
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
    if (body.type !== undefined) {
        updates.push('type = ?');
        values.push(body.type);
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
    UPDATE income_events
    SET ${updates.join(', ')}
    WHERE id = ? AND user_id = ?
  `).bind(...values).run();

    return c.json({ success: true });
});

// Delete income event
incomeRoutes.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    await db.prepare(`
    DELETE FROM income_events WHERE id = ? AND user_id = ?
  `).bind(id, DEFAULT_USER_ID).run();

    return c.json({ success: true });
});

// Seed paychecks for a year
incomeRoutes.post('/seed-paychecks', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json<{
        year: number;
        first_paycheck_date: string; // YYYY-MM-DD
        paycheck_amount_cents: number;
    }>();

    if (!body.year || !body.first_paycheck_date || !body.paycheck_amount_cents) {
        return c.json({ error: 'year, first_paycheck_date, and paycheck_amount_cents are required' }, 400);
    }

    // Delete existing paychecks for this year
    await db.prepare(`
    DELETE FROM income_events 
    WHERE user_id = ? AND strftime('%Y', date) = ?
  `).bind(DEFAULT_USER_ID, String(body.year)).run();

    // Generate bi-weekly paychecks
    const paychecks: Array<{ date: string; type: 'base' | 'bonus' }> = [];
    let currentDate = new Date(body.first_paycheck_date);
    const yearEnd = new Date(body.year, 11, 31);

    // Track paychecks per month to identify 3-paycheck months
    const paychecksByMonth: Record<string, string[]> = {};

    while (currentDate <= yearEnd) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        if (!paychecksByMonth[monthKey]) {
            paychecksByMonth[monthKey] = [];
        }
        paychecksByMonth[monthKey].push(dateStr);

        // Move to next paycheck (14 days)
        currentDate.setDate(currentDate.getDate() + 14);
    }

    // Determine which paychecks are bonus (3rd paycheck in a month)
    for (const [month, dates] of Object.entries(paychecksByMonth)) {
        dates.forEach((date, index) => {
            paychecks.push({
                date,
                type: index >= 2 ? 'bonus' : 'base', // 3rd+ paycheck is bonus
            });
        });
    }

    // Insert paychecks
    const statements = paychecks.map((p) =>
        db.prepare(`
      INSERT INTO income_events (user_id, date, amount_cents, type, note)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
            DEFAULT_USER_ID,
            p.date,
            body.paycheck_amount_cents,
            p.type,
            p.type === 'bonus' ? 'Bonus Paycheck (3rd paycheck month)' : 'Regular Paycheck'
        )
    );

    await db.batch(statements);

    // Find 3-paycheck months
    const bonusMonths = Object.entries(paychecksByMonth)
        .filter(([_, dates]) => dates.length >= 3)
        .map(([month]) => month);

    return c.json({
        success: true,
        total_paychecks: paychecks.length,
        base_paychecks: paychecks.filter(p => p.type === 'base').length,
        bonus_paychecks: paychecks.filter(p => p.type === 'bonus').length,
        bonus_months: bonusMonths,
    });
});
