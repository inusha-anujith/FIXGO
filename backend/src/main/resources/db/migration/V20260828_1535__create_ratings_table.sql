-- FR-14 Rating & Review. A customer rates a completed job.

CREATE TABLE ratings (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id      UUID        NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    customer_id UUID        NOT NULL REFERENCES users (id),
    provider_id UUID        NOT NULL REFERENCES users (id),
    stars       SMALLINT    NOT NULL,
    comment     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_ratings_stars CHECK (stars BETWEEN 1 AND 5),

    -- One rating per job, enforced in the database. The service layer will also
    -- check, but that check has a race window: two concurrent submissions can
    -- both pass it. This constraint cannot be raced -- the second INSERT fails.
    CONSTRAINT uq_ratings_job UNIQUE (job_id),

    CONSTRAINT chk_ratings_distinct_parties CHECK (provider_id <> customer_id)
);

-- FR-10: recompute a provider's average rating.
CREATE INDEX idx_ratings_provider ON ratings (provider_id, created_at DESC);

COMMENT ON COLUMN ratings.provider_id IS
    'Copied from jobs.provider_id at rating time so provider history survives even if the job row is later reassigned.';
