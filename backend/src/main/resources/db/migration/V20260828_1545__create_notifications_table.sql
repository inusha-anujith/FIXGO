-- FR-19 Notifications. The in-app notification feed. Delivery to devices is
-- handled separately via FCM tokens (see device_tokens).

CREATE TABLE notifications (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type       VARCHAR(40)  NOT NULL,
    title      VARCHAR(150) NOT NULL,
    body       VARCHAR(500) NOT NULL,
    job_id     UUID         REFERENCES jobs (id) ON DELETE CASCADE,
    read_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT chk_notifications_type CHECK (type IN (
        'JOB_CREATED',
        'JOB_ACCEPTED',
        'JOB_STATUS_CHANGED',
        'JOB_CANCELLED',
        'JOB_COMPLETED',
        'RATING_RECEIVED',
        'NEW_MESSAGE',
        'PROVIDER_VERIFIED',
        'ACCOUNT_SUSPENDED'
    ))
);

-- The notification feed: one user's notifications, newest first.
CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);

-- The unread badge count. A partial index over unread rows only stays small
-- even for a user with thousands of read notifications.
CREATE INDEX idx_notifications_unread
    ON notifications (user_id)
    WHERE read_at IS NULL;

COMMENT ON COLUMN notifications.read_at IS
    'NULL means unread. Storing a timestamp rather than a boolean also records when it was read, at no extra cost.';

COMMENT ON COLUMN notifications.body IS
    'Rendered message text. Must never contain a phone number or address before job acceptance (NFR-02).';
