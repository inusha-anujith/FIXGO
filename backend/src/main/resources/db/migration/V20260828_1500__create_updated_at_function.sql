-- Shared trigger function keeping updated_at accurate on every table.
--
-- NFR-09 requires reliable timestamps. Doing this in the database rather than
-- in JPA (@UpdateTimestamp) means the column stays correct even when a row is
-- changed by an admin SQL statement, a data fix or a future service written in
-- another language.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
