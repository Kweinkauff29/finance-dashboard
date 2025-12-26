import { Hono } from 'hono';
import type { Bindings } from '../index';
import { DEFAULT_USER_ID, type Category } from '../db/types';

export const categoriesRoutes = new Hono<{ Bindings: Bindings }>();

// Get all categories
categoriesRoutes.get('/', async (c) => {
    const db = c.env.DB;

    const result = await db.prepare(`
    SELECT id, name, color, sort_order, active
    FROM categories
    WHERE active = 1
    ORDER BY sort_order ASC
  `).all<Category>();

    return c.json({
        categories: result.results || [],
    });
});

// Get single category
categoriesRoutes.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    const result = await db.prepare(`
    SELECT id, name, color, sort_order, active
    FROM categories
    WHERE id = ?
  `).bind(id).first<Category>();

    if (!result) {
        return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({ category: result });
});

// Create category
categoriesRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json<{
        name: string;
        color?: string;
        sort_order?: number;
    }>();

    if (!body.name) {
        return c.json({ error: 'Name is required' }, 400);
    }

    // Get max sort_order
    const maxOrder = await db.prepare(`
    SELECT MAX(sort_order) as max_order FROM categories
  `).first<{ max_order: number }>();

    const sortOrder = body.sort_order ?? ((maxOrder?.max_order ?? 0) + 1);
    const color = body.color ?? '#6366f1';

    const result = await db.prepare(`
    INSERT INTO categories (name, color, sort_order, active)
    VALUES (?, ?, ?, 1)
    RETURNING id
  `).bind(body.name, color, sortOrder).first<{ id: number }>();

    return c.json({
        success: true,
        id: result?.id,
    }, 201);
});

// Update category
categoriesRoutes.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;
    const body = await c.req.json<{
        name?: string;
        color?: string;
        sort_order?: number;
        active?: boolean;
    }>();

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (body.name !== undefined) {
        updates.push('name = ?');
        values.push(body.name);
    }
    if (body.color !== undefined) {
        updates.push('color = ?');
        values.push(body.color);
    }
    if (body.sort_order !== undefined) {
        updates.push('sort_order = ?');
        values.push(body.sort_order);
    }
    if (body.active !== undefined) {
        updates.push('active = ?');
        values.push(body.active ? 1 : 0);
    }

    if (updates.length === 0) {
        return c.json({ error: 'No fields to update' }, 400);
    }

    values.push(id);

    await db.prepare(`
    UPDATE categories
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...values).run();

    return c.json({ success: true });
});

// Delete (soft delete) category
categoriesRoutes.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const db = c.env.DB;

    await db.prepare(`
    UPDATE categories SET active = 0 WHERE id = ?
  `).bind(id).run();

    return c.json({ success: true });
});
