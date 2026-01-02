-- Mood tracker entries
CREATE TABLE mood_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default',
    date TEXT NOT NULL,
    mood_level INTEGER NOT NULL CHECK(mood_level >= 1 AND mood_level <= 5),
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Index for efficient year queries
CREATE INDEX idx_mood_user_date ON mood_entries(user_id, date);
