-- FR-04 Service Categories. A provider offers several categories, so these are
-- rows rather than a column.

CREATE TABLE provider_service_types (
    provider_user_id UUID        NOT NULL REFERENCES provider_profiles (user_id) ON DELETE CASCADE,
    service_type     VARCHAR(20) NOT NULL,

    PRIMARY KEY (provider_user_id, service_type),
    CONSTRAINT chk_provider_service_type
        CHECK (service_type IN ('MECHANIC', 'TOWING', 'BATTERY', 'TYRE', 'FUEL', 'OTHER'))
);

-- FR-05/FR-20: find providers offering the service a job needs.
CREATE INDEX idx_provider_service_types_type ON provider_service_types (service_type);
