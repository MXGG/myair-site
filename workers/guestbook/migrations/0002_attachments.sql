CREATE TABLE IF NOT EXISTS guestbook_attachments (
    id TEXT PRIMARY KEY,
    message_id INTEGER NOT NULL,
    object_key TEXT NOT NULL UNIQUE,
    original_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    byte_size INTEGER NOT NULL CHECK (byte_size > 0),
    created_at INTEGER NOT NULL,
    FOREIGN KEY (message_id) REFERENCES guestbook_messages (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_guestbook_attachments_message_id
    ON guestbook_attachments (message_id, created_at);
