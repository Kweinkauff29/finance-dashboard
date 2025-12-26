import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { categoriesRoutes } from './routes/categories';
import { budgetsRoutes } from './routes/budgets';
import { transactionsRoutes } from './routes/transactions';
import { summaryRoutes } from './routes/summary';
import { calendarRoutes } from './routes/calendar';
import { goalsRoutes } from './routes/goals';
import { incomeRoutes } from './routes/income';
import { transfersRoutes } from './routes/transfers';
import { reportsRoutes } from './routes/reports';

export type Bindings = {
    DB: D1Database;
    ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS for frontend
app.use('/api/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
}));

// Health check
app.get('/api/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.route('/api/categories', categoriesRoutes);
app.route('/api/budgets', budgetsRoutes);
app.route('/api/transactions', transactionsRoutes);
app.route('/api/month', summaryRoutes);
app.route('/api/calendar', calendarRoutes);
app.route('/api/goals', goalsRoutes);
app.route('/api/income', incomeRoutes);
app.route('/api/transfers', transfersRoutes);
app.route('/api/reports', reportsRoutes);

// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error('Error:', err);
    return c.json({ error: err.message }, 500);
});

export default app;
