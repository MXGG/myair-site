CREATE TABLE IF NOT EXISTS guestbook_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    read_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_guestbook_messages_created_at
    ON guestbook_messages (created_at DESC);

CREATE TABLE IF NOT EXISTS guestbook_captchas (
    id TEXT PRIMARY KEY,
    answer_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0 CHECK (used IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_guestbook_captchas_expires_at
    ON guestbook_captchas (expires_at);

CREATE TABLE IF NOT EXISTS guestbook_rate_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_hash TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('captcha', 'message')),
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guestbook_rate_events_lookup
    ON guestbook_rate_events (ip_hash, action, created_at);
