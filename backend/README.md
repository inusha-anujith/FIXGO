# FIXGO Backend

Spring Boot REST API for the FIXGO vehicle assistance marketplace. See the root [README.md](../README.md) for the overall project and folder-structure rationale.

## 1. Stack

| Component | Choice |
|---|---|
| Language | Java 25 |
| Framework | Spring Boot 4.1.1 |
| Build tool | Maven (wrapper committed — no local install needed) |
| Database | PostgreSQL 18 (Neon) |
| Migrations | Flyway |
| Auth | Email/password first; OTP later |

## 2. Structure

Modular by business domain (`auth`, `user`, `vehicle`, `provider`, `job`, `rating`, `chat`, `report`, `notification`, `admin`), each with `controller` / `service` / `repository` / `entity` / `dto` sub-packages, plus shared `config` and `common`. See the root README's [Backend Structure](../README.md#3-backend-structure-backend) section for the full tree and the two modules that deliberately have no entity or repository.

## 3. Getting Started

### Prerequisites

- JDK 25 (`java -version` should report 25)
- A Neon PostgreSQL database

Maven is **not** required — use the committed wrapper (`./mvnw`).

### Configure the database

Credentials are read from the environment and must never be committed (NFR-01). Neon hands you a **libpq** URI:

```
postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

JDBC will not accept that string. Convert it — prefix `jdbc:`, and split the credentials out. Use the **direct** endpoint host, not the `-pooler` one, so Flyway's locking works correctly.

Copy the template and fill in your values:

```bash
cd backend
cp .env.example .env
chmod 600 .env
$EDITOR .env
```

`.env` is gitignored and must never be committed. `.env.example` is committed as documentation and holds no real credentials.

You do **not** need to export or source anything. `application.properties` contains:

```properties
spring.config.import=optional:file:./.env[.properties]
```

so Boot loads `backend/.env` at startup, and `./mvnw spring-boot:run` and your IDE both work with no extra setup. `optional:` means startup still succeeds when the file is absent — which is what deployed environments do, supplying real environment variables instead. **Real environment variables take precedence over the file**, so a hosting platform's config always wins over a stray local `.env`.

If you would rather not keep a file at all, exporting the three variables works exactly as well:

```bash
export DB_URL='jdbc:postgresql://HOST/neondb?sslmode=require'
export DB_USER='your_user'
export DB_PASSWORD='your_password'
```

### Run

```bash
cd backend
./mvnw spring-boot:run
```

The app listens on `http://localhost:8080`. On first start Flyway creates the schema and a `flyway_schema_history` table recording what it applied.

### Build and test

```bash
./mvnw clean package     # produces target/fixgo-backend-0.0.1-SNAPSHOT.jar
./mvnw test
```

## 4. Database Migrations

The schema is owned by Flyway, **not** by Hibernate. `spring.jpa.hibernate.ddl-auto=validate` means Hibernate only checks that the `@Entity` classes match what the migrations produced, and fails startup if they have drifted — which is how a forgotten migration is caught in seconds rather than at runtime.

Migrations live in `src/main/resources/db/migration` and are named:

```
V<yyyyMMdd>_<HHmm>__<description>.sql
```

Two underscores before the description. Timestamp versions rather than `V1`/`V2` because sequential numbers collide when two people branch in parallel — both merge cleanly into git, and then Flyway refuses to start.

**A migration is immutable once merged.** Flyway records a checksum of each applied file; editing one breaks startup for everybody. Correct a mistake by adding a new migration.

Current schema (see [ADR-001](docs/adr-001-user-and-provider-data-model.md) for the user/provider model):

| Table | Requirements |
|---|---|
| `users` | FR-01, FR-18 |
| `provider_profiles`, `provider_service_types` | FR-04, FR-06, FR-10, FR-16 |
| `vehicles` | FR-02 |
| `jobs` | FR-03, FR-05, FR-07, FR-08, FR-09, FR-12, FR-13 |
| `job_status_history` | NFR-09, NFR-11 |
| `ratings` | FR-14 |
| `reports` | FR-17 |
| `notifications`, `device_tokens` | FR-19 |
| `chat_threads`, `chat_messages` | Phase 2 |

## 5. Conventions

- New features get their own domain package, not a shared `services`/`controllers` package.
- Keep entities, DTOs and repositories inside their owning domain — cross-domain reads go through that domain's service, not its repository.
- An entity has exactly one owning module. Never declare a second `@Entity` for a table another module owns.
- Controllers return DTOs, never entities. Returning a `User` entity serialises its password hash and phone number (NFR-01, NFR-02).
- Prefer constructor injection over `@Autowired` fields, so dependencies are `final` and the class is testable without Spring.
- `accept job` must be a single conditional `UPDATE ... WHERE status = 'OPEN'` and decide the winner from the affected row count. Read-check-save leaves a race window in which two providers both accept (FR-08, NFR-04).
