// API Client for Finance Dashboard

// Use local worker in development, deployed worker in production
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8787/api'
    : 'https://finance-dashboard-api.bonitaspringsrealtors.workers.dev/api';

// Helper to format cents as currency
export function formatCurrency(cents, showSign = false) {
    const dollars = cents / 100;
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Math.abs(dollars));

    if (showSign && cents !== 0) {
        return cents > 0 ? `+${formatted}` : `-${formatted}`;
    }
    return cents < 0 ? `-${formatted}` : formatted;
}

// Helper to convert dollars to cents
export function dollarsToCents(dollars) {
    return Math.round(parseFloat(dollars) * 100);
}

// Helper to format date
export function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

// Helper to get month name
export function getMonthName(month) {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
}

// API request helper
async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    // Handle CSV downloads
    if (response.headers.get('Content-Type')?.includes('text/csv')) {
        return response.blob();
    }

    return response.json();
}

// API methods
export const api = {
    // Categories
    getCategories: () => request('/categories'),
    createCategory: (data) => request('/categories', { method: 'POST', body: data }),
    updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: data }),
    deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

    // Budgets
    getBudgets: (year, month) => request(`/budgets/${year}/${month}`),
    updateBudgets: (year, month, budgets) => request(`/budgets/${year}/${month}`, {
        method: 'PUT',
        body: { budgets },
    }),
    copyBudgets: (year, month) => request(`/budgets/${year}/${month}/copy`, { method: 'POST' }),
    getRebalanceSuggestions: () => request('/budgets/rebalance'),

    // Transactions
    getTransactions: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/transactions${query ? `?${query}` : ''}`);
    },
    getTransaction: (id) => request(`/transactions/${id}`),
    createTransaction: (data) => request('/transactions', { method: 'POST', body: data }),
    updateTransaction: (id, data) => request(`/transactions/${id}`, { method: 'PUT', body: data }),
    deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
    duplicateTransaction: (id, date) => request(`/transactions/${id}/duplicate`, {
        method: 'POST',
        body: { date },
    }),
    getMerchantSuggestions: (q) => request(`/transactions/merchants/autocomplete?q=${encodeURIComponent(q)}`),

    // Month Summary
    getMonthSummary: (year, month) => request(`/month/${year}/${month}/summary`),

    // Calendar
    getCalendarData: (start, end, categoryId) => {
        let url = `/calendar?start=${start}&end=${end}`;
        if (categoryId) url += `&category_id=${categoryId}`;
        return request(url);
    },
    getDayDetail: (date) => request(`/calendar/day/${date}`),

    // Goals
    getGoals: () => request('/goals'),
    getGoal: (id) => request(`/goals/${id}`),
    createGoal: (data) => request('/goals', { method: 'POST', body: data }),
    updateGoal: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: data }),
    deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
    contributeToGoal: (id, data) => request(`/goals/${id}/contribute`, { method: 'POST', body: data }),
    withdrawFromGoal: (id, data) => request(`/goals/${id}/withdraw`, { method: 'POST', body: data }),

    // Income
    getIncome: (year) => request(`/income${year ? `?year=${year}` : ''}`),
    createIncome: (data) => request('/income', { method: 'POST', body: data }),
    updateIncome: (id, data) => request(`/income/${id}`, { method: 'PUT', body: data }),
    deleteIncome: (id) => request(`/income/${id}`, { method: 'DELETE' }),
    seedPaychecks: (data) => request('/income/seed-paychecks', { method: 'POST', body: data }),

    // Transfers
    getTransfers: (year, month) => {
        let url = '/transfers';
        const params = [];
        if (year) params.push(`year=${year}`);
        if (month) params.push(`month=${month}`);
        if (params.length) url += `?${params.join('&')}`;
        return request(url);
    },
    createTransfer: (data) => request('/transfers', { method: 'POST', body: data }),
    deleteTransfer: (id) => request(`/transfers/${id}`, { method: 'DELETE' }),

    // Reports
    getYearlyReport: (year) => request(`/reports/yearly/${year}`),
    exportCsv: (year, month) => {
        let url = '/reports/export/csv';
        const params = [];
        if (year) params.push(`year=${year}`);
        if (month) params.push(`month=${month}`);
        if (params.length) url += `?${params.join('&')}`;
        return request(url);
    },
};

export default api;
