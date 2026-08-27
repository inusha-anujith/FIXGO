-- FR-06 Availability, FR-10 Provider Profile, FR-16 Provider Verification.
-- Provider-only attributes, one row per provider user (ADR-001).

CREATE TABLE provider_profiles (
    user_id             UUID          PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    business_name       VARCHAR(150),
    verification_status VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    availability        VARCHAR(20)   NOT NULL DEFAULT 'OFFLINE',
    base_latitude       NUMERIC(9, 6),
    base_longitude      NUMERIC(9, 6),
    rating_average      NUMERIC(2, 1),
    rating_count        INTEGER       NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT chk_provider_verification CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    CONSTRAINT chk_provider_availability CHECK (availability        IN ('AVAILABLE', 'BUSY', 'OFFLINE')),
    CONSTRAINT chk_provider_rating_avg   CHECK (rating_average IS NULL OR rating_average BETWEEN 1.0 AND 5.0),
    CONSTRAINT chk_provider_rating_count CHECK (rating_count >= 0)
);

-- The primary key IS the foreign key. This enforces the 1:1 with users at the
-- schema level: a second profile row for the same user is impossible, and no
-- surrogate id is needed.

-- NFR-03: only verified providers may accept public jobs. This index serves the
-- "who can take work right now" lookup behind FR-05.
CREATE INDEX idx_provider_verified_available
    ON provider_profiles (verification_status, availability)
    WHERE verification_status = 'VERIFIED';

CREATE TRIGGER trg_provider_profiles_updated_at
    BEFORE UPDATE ON provider_profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON COLUMN provider_profiles.rating_average IS
    'Denormalised from ratings (FR-10). Recalculated when a rating is created.';
