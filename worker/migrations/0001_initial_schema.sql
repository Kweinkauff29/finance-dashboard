-- Categories with color coding and ordering
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1',
    sort_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1
);

-- Monthly budgets per category
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default',
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    budget_cents INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE(user_id, year, month, category_id)
);

-- Individual transactions
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default',
    date TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    merchant TEXT,
    category_id INTEGER NOT NULL,
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Historical monthly rollups (for imported data)
CREATE TABLE monthly_rollups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default',
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    actual_cents INTEGER NOT NULL,
    label_text TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE(user_id, year, month, category_id)
);

-- Income events (paychecks)
CREATE TABLE income_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default',
    date TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    type TEXT CHECK(type IN ('base', 'bonus')) NOT NULL,
    note TEXT
);

-- Savings goals
CREATE TABLE goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default',
    name TEXT NOT NULL,
    target_cents INTEGER NOT NULL,
    current_cents INTEGER DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    is_rainy_day INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Transfers between buckets (e.g., rainy day withdrawals)
CREATE TABLE transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default',
    date TEXT NOT NULL,
    from_bucket TEXT NOT NULL,
    to_bucket TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_budgets_month ON budgets(year, month);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, year, month);
CREATE INDEX idx_income_date ON income_events(date);
CREATE INDEX idx_income_user_date ON income_events(user_id, date);
CREATE INDEX idx_rollups_month ON monthly_rollups(user_id, year, month);
