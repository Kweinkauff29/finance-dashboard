// Database helper utilities

export interface Category {
    id: number;
    name: string;
    color: string;
    sort_order: number;
    active: number;
}

export interface Budget {
    id: number;
    user_id: string;
    year: number;
    month: number;
    category_id: number;
    budget_cents: number;
}

export interface Transaction {
    id: number;
    user_id: string;
    date: string;
    amount_cents: number;
    merchant: string | null;
    category_id: number;
    note: string | null;
    created_at: string;
}

export interface MonthlyRollup {
    id: number;
    user_id: string;
    year: number;
    month: number;
    category_id: number;
    actual_cents: number;
    label_text: string | null;
}

export interface IncomeEvent {
    id: number;
    user_id: string;
    date: string;
    amount_cents: number;
    type: 'base' | 'bonus';
    note: string | null;
}

export interface Goal {
    id: number;
    user_id: string;
    name: string;
    target_cents: number;
    current_cents: number;
    start_date: string | null;
    end_date: string | null;
    is_rainy_day: number;
    created_at: string;
}

export interface Transfer {
    id: number;
    user_id: string;
    date: string;
    from_bucket: string;
    to_bucket: string;
    amount_cents: number;
    note: string | null;
    created_at: string;
}

// Helper to convert cents to dollars for display
export function centsToDollars(cents: number): number {
    return cents / 100;
}

// Helper to convert dollars to cents for storage
export function dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

// Get start and end of month
export function getMonthRange(year: number, month: number): { start: string; end: string } {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    return { start, end };
}

// Default user ID (single-user for now)
export const DEFAULT_USER_ID = 'default';
