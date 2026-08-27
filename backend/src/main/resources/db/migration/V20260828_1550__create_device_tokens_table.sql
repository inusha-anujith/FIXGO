-- FR-19 Notifications, delivery side. Firebase Cloud Messaging registration
-- tokens, so a notification can be pushed to a user's devices.

CREATE TABLE device_tokens (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    fcm_token    VARCHAR(255) NOT NULL,
    platform     VARCHAR(10)  NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT chk_device_token_platform CHECK (platform IN ('ANDROID', 'IOS', 'WEB')),

    -- Unique on the token, NOT on (user_id, token). FCM tokens belong to an app
    -- install, not a person: if two people log into the same phone, the token
    -- must move to the second user, or the first keeps receiving the second
    -- user's notifications. Registration is an upsert on this constraint that
    -- reassigns user_id.
    CONSTRAINT uq_device_tokens_token UNIQUE (fcm_token)
);

-- Fan-out: every device belonging to one user.
CREATE INDEX idx_device_tokens_user ON device_tokens (user_id);

COMMENT ON COLUMN device_tokens.last_seen_at IS
    'Refreshed when the client re-registers. FCM tokens expire; stale rows can be pruned by age.';
