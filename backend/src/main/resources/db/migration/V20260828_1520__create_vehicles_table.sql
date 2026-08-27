-- FR-02 Vehicle Profile.

CREATE TABLE vehicles (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id            UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    registration_number VARCHAR(20) NOT NULL,
    vehicle_type        VARCHAR(20) NOT NULL,
    make                VARCHAR(50),
    model               VARCHAR(50),
    year_of_manufacture SMALLINT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_vehicle_type CHECK (vehicle_type IN
        ('CAR', 'VAN', 'SUV', 'MOTORCYCLE', 'THREE_WHEELER', 'LORRY', 'BUS', 'OTHER')),
    CONSTRAINT chk_vehicle_year CHECK (year_of_manufacture IS NULL
        OR year_of_manufacture BETWEEN 1900 AND 2100)
);

-- The same plate may not be registered twice by one owner. Case-insensitive
-- because users type "abc-1234" and "ABC-1234" interchangeably. Deliberately
-- scoped per owner rather than globally: vehicles change hands, and a global
-- unique constraint would block a new owner from registering a used vehicle.
CREATE UNIQUE INDEX uq_vehicles_owner_registration
    ON vehicles (owner_id, UPPER(registration_number));

CREATE INDEX idx_vehicles_owner ON vehicles (owner_id);

CREATE TRIGGER trg_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON COLUMN vehicles.vehicle_type IS
    'THREE_WHEELER included deliberately: a major vehicle class in the Sri Lankan pilot market.';
