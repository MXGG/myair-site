ALTER TABLE guestbook_messages ADD COLUMN ready_at INTEGER NOT NULL DEFAULT 1;

UPDATE guestbook_messages
SET ready_at = created_at
WHERE ready_at = 1;

CREATE INDEX IF NOT EXISTS idx_guestbook_messages_ready_id
    ON guestbook_messages (ready_at, id);
