import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID } from '../db/types';

export const moodRoutes = new Hono<{ Bindings: Bindings }>();

// Get all mood entries for a year
moodRoutes.get('/:year', async (c) => {
    const year = parseInt(c.req.param('year'));
    const db = c.env.DB;

    const result = await db.prepare(`
        SELECT id, date, mood_level, note, created_at
        FROM mood_entries
        WHERE user_id = ? AND date LIKE ?
        ORDER BY date ASC
    `).bind(DEFAULT_USER_ID, `${year}-%`).all();

    return c.json({
        year,
        entries: result.results || [],
    });
});

// Get single day's mood
moodRoutes.get('/:year/:month/:day', async (c) => {
    const year = c.req.param('year');
    const month = c.req.param('month').padStart(2, '0');
    const day = c.req.param('day').padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    const db = c.env.DB;

    const result = await db.prepare(`
        SELECT id, date, mood_level, note, created_at
        FROM mood_entries
        WHERE user_id = ? AND date = ?
    `).bind(DEFAULT_USER_ID, date).first();

    if (!result) {
        return c.json({ entry: null });
    }

    return c.json({ entry: result });
});

// Create or update mood entry (upsert)
moodRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json<{
        date: string;
        mood_level: number;
        note?: string;
    }>();

    if (!body.date || !body.mood_level) {
        return c.json({ error: 'Date and mood_level are required' }, 400);
    }

    if (body.mood_level < 1 || body.mood_level > 5) {
        return c.json({ error: 'Mood level must be between 1 and 5' }, 400);
    }

    await db.prepare(`
        INSERT INTO mood_entries (user_id, date, mood_level, note)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (user_id, date)
        DO UPDATE SET mood_level = excluded.mood_level, note = excluded.note
    `).bind(DEFAULT_USER_ID, body.date, body.mood_level, body.note || null).run();

    return c.json({ success: true });
});

// Delete mood entry
moodRoutes.delete('/:year/:month/:day', async (c) => {
    const year = c.req.param('year');
    const month = c.req.param('month').padStart(2, '0');
    const day = c.req.param('day').padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    const db = c.env.DB;

    await db.prepare(`
        DELETE FROM mood_entries
        WHERE user_id = ? AND date = ?
    `).bind(DEFAULT_USER_ID, date).run();

    return c.json({ success: true });
});
