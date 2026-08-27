-- Customer/provider messaging. Phase 2 per the spec (Section 10 defers advanced
-- real-time chat); the schema lands now so the rest of the model is complete.
--
-- FR-11 Contact: messaging exists only after acceptance. NFR-02 Privacy: a chat
-- thread is the mechanism that lets the two parties talk WITHOUT publishing
-- phone numbers.

CREATE TABLE chat_threads (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id     UUID        NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- One thread per job. The thread is created when the job is accepted, which
    -- is what ties messaging to FR-11: no acceptance, no thread, no contact.
    CONSTRAINT uq_chat_threads_job UNIQUE (job_id)
);

CREATE TABLE chat_messages (
    id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id  UUID          NOT NULL REFERENCES chat_threads (id) ON DELETE CASCADE,
    sender_id  UUID          NOT NULL REFERENCES users (id),
    body       VARCHAR(2000) NOT NULL,
    read_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT chk_chat_message_body_not_blank CHECK (length(btrim(body)) > 0)
);

-- Message list for a thread, oldest first.
CREATE INDEX idx_chat_messages_thread ON chat_messages (thread_id, created_at);

-- Unread count per thread.
CREATE INDEX idx_chat_messages_unread
    ON chat_messages (thread_id, sender_id)
    WHERE read_at IS NULL;

COMMENT ON TABLE chat_threads IS
    'Participants are derived from the job (customer_id, provider_id) rather than stored, so authorisation cannot drift out of sync with the job.';
