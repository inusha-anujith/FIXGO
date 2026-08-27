-- NFR-09 Audit, supporting FR-09 Job Status and FR-13 Cancellation.
-- Append-only record of every status transition.

CREATE TABLE job_status_history (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id      UUID        NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    from_status VARCHAR(20),
    to_status   VARCHAR(20) NOT NULL,
    changed_by  UUID        REFERENCES users (id),
    note        VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_job_history_to_status CHECK (to_status IN
        ('OPEN', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'COMPLETED', 'CANCELLED')),

    -- from_status is NULL only for the initial row written at creation.
    CONSTRAINT chk_job_history_from_status CHECK (from_status IS NULL OR from_status IN
        ('OPEN', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'COMPLETED', 'CANCELLED'))
);

-- Timeline for one job, oldest first.
CREATE INDEX idx_job_status_history_job ON job_status_history (job_id, created_at);

-- NFR-11 Fraud Prevention: find repeated cancellations by one actor.
CREATE INDEX idx_job_status_history_cancellations
    ON job_status_history (changed_by, created_at DESC)
    WHERE to_status = 'CANCELLED';

COMMENT ON TABLE job_status_history IS
    'Append-only. Rows are never updated or deleted; the audit trail (NFR-09) depends on it.';
