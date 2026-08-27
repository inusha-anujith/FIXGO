-- FR-01 Registration & Login. Identity and credentials for every account,
-- customer, provider and admin alike, per ADR-001.

CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(150) NOT NULL,
    phone         VARCHAR(20),
    role          VARCHAR(20)  NOT NULL,
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT chk_users_role   CHECK (role   IN ('CUSTOMER', 'PROVIDER', 'ADMIN')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'SUSPENDED'))
);

-- Email uniqueness must be case-insensitive: "Nimal@x.lk" and "nimal@x.lk" are
-- the same account. A plain UNIQUE column would let both register, and login
-- would then be ambiguous. Queries must use LOWER(email) to hit this index.
CREATE UNIQUE INDEX uq_users_email ON users (LOWER(email));

-- FR-18: admin lists users filtered by role and suspension state.
CREATE INDEX idx_users_role_status ON users (role, status);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON COLUMN users.password_hash IS 'BCrypt hash (NFR-01). Never leaves the service layer.';
COMMENT ON COLUMN users.phone         IS 'Disclosed only after job acceptance (NFR-02, FR-11).';
COMMENT ON COLUMN users.status        IS 'SUSPENDED blocks login and job acceptance (FR-18).';
