-- FR-03 Create Request, FR-05 Nearby Open Jobs, FR-07 Accept Job,
-- FR-08 First-Come Lock, FR-09 Job Status, FR-12 Location Sharing,
-- FR-13 Cancellation. The core table of the marketplace.

CREATE TABLE jobs (
    id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID          NOT NULL REFERENCES users (id),
    vehicle_id          UUID          REFERENCES vehicles (id) ON DELETE SET NULL,
    provider_id         UUID          REFERENCES users (id),
    service_type        VARCHAR(20)   NOT NULL,
    status              VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
    description         TEXT,
    latitude            NUMERIC(9, 6) NOT NULL,
    longitude           NUMERIC(9, 6) NOT NULL,
    address_note        VARCHAR(255),
    accepted_at         TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    cancelled_by        UUID          REFERENCES users (id),
    cancellation_reason VARCHAR(255),
    version             INTEGER       NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT chk_jobs_service_type CHECK (service_type IN
        ('MECHANIC', 'TOWING', 'BATTERY', 'TYRE', 'FUEL', 'OTHER')),

    CONSTRAINT chk_jobs_status CHECK (status IN
        ('OPEN', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'COMPLETED', 'CANCELLED')),

    CONSTRAINT chk_jobs_latitude  CHECK (latitude  BETWEEN -90  AND 90),
    CONSTRAINT chk_jobs_longitude CHECK (longitude BETWEEN -180 AND 180),

    -- A customer cannot be their own provider.
    CONSTRAINT chk_jobs_distinct_parties CHECK (provider_id IS NULL OR provider_id <> customer_id),

    -- FR-08 First-Come Lock, expressed as a database invariant: an OPEN job has
    -- no provider, and any job past acceptance has one. No application bug can
    -- produce a half-accepted row.
    CONSTRAINT chk_jobs_acceptance_consistency CHECK (
        (status = 'OPEN'      AND provider_id IS NULL     AND accepted_at IS NULL)
     OR (status = 'CANCELLED')
     OR (status IN ('ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'COMPLETED')
            AND provider_id IS NOT NULL AND accepted_at IS NOT NULL)
    ),

    CONSTRAINT chk_jobs_completed_at CHECK (status <> 'COMPLETED' OR completed_at IS NOT NULL),
    CONSTRAINT chk_jobs_cancelled_at CHECK (status <> 'CANCELLED' OR cancelled_at IS NOT NULL)
);

-- FR-05/FR-20: providers list open jobs by service type, newest first. A
-- partial index covering only OPEN rows stays small no matter how many
-- completed jobs accumulate, because completed rows are not in the index.
CREATE INDEX idx_jobs_open_by_service
    ON jobs (service_type, created_at DESC)
    WHERE status = 'OPEN';

-- FR-15 History, customer side.
CREATE INDEX idx_jobs_customer_history ON jobs (customer_id, created_at DESC);

-- FR-15 History, provider side.
CREATE INDEX idx_jobs_provider_history
    ON jobs (provider_id, created_at DESC)
    WHERE provider_id IS NOT NULL;

CREATE TRIGGER trg_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON COLUMN jobs.provider_id IS
    'NULL until a provider accepts (FR-07). References users(id) per ADR-001; there is no separate providers table.';

COMMENT ON COLUMN jobs.version IS
    'JPA @Version, for optimistic locking on status updates after acceptance.';

-- NFR-04 Concurrency. The accept operation must NOT be read-then-write:
--
--     UPDATE jobs SET provider_id = ?, status = 'ACCEPTED', accepted_at = now()
--     WHERE id = ? AND status = 'OPEN';
--
-- A single conditional UPDATE is atomic. Postgres serialises the two competing
-- statements, so exactly one reports 1 row updated and the other reports 0 --
-- that row count is how the service decides who won. Reading the job, checking
-- status in Java, then saving leaves a window in which both providers pass the
-- check and the second silently overwrites the first.
