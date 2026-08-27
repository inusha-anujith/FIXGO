-- FR-17 Reports. Fraud, overcharging or unsafe behaviour, resolved by admin
-- (FR-18).

CREATE TABLE reports (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id           UUID        REFERENCES jobs (id) ON DELETE SET NULL,
    reporter_id      UUID        NOT NULL REFERENCES users (id),
    reported_user_id UUID        REFERENCES users (id),
    reason           VARCHAR(30) NOT NULL,
    details          TEXT,
    status           VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    resolved_by      UUID        REFERENCES users (id),
    resolved_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_reports_reason CHECK (reason IN
        ('FRAUD', 'OVERCHARGING', 'UNSAFE_BEHAVIOUR', 'NO_SHOW', 'DAMAGE', 'OTHER')),

    CONSTRAINT chk_reports_status CHECK (status IN
        ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED')),

    CONSTRAINT chk_reports_not_self CHECK (reported_user_id IS NULL OR reported_user_id <> reporter_id),

    CONSTRAINT chk_reports_resolution CHECK (
        (status IN ('OPEN', 'UNDER_REVIEW') AND resolved_at IS NULL)
     OR (status IN ('RESOLVED', 'DISMISSED') AND resolved_at IS NOT NULL AND resolved_by IS NOT NULL)
    )
);

-- FR-18: the admin queue, oldest unresolved first.
CREATE INDEX idx_reports_open ON reports (created_at)
    WHERE status IN ('OPEN', 'UNDER_REVIEW');

-- NFR-11: count complaints accumulated against one user.
CREATE INDEX idx_reports_reported_user ON reports (reported_user_id, created_at DESC);

CREATE TRIGGER trg_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON COLUMN reports.job_id IS
    'ON DELETE SET NULL: a report outlives its job, since the complaint history matters after the job is gone.';
