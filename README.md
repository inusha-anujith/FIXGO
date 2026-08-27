# FIXGO — Vehicle Assistance Marketplace

Sri Lankan roadside vehicle assistance platform. A vehicle owner creates a breakdown/service request with location and required service; nearby mechanics, garages and towing operators see open jobs and accept on a first-come basis. This repository contains the mobile app and backend API for the MVP described in the project's business/requirements document.

## 1. Repository Layout

| Folder | Description |
|---|---|
| [backend/](backend/) | Spring Boot REST API (Java, Maven). |
| [frontend/](frontend/) | React Native app targeting Android and iOS. |

Each has its own README with setup instructions — see [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md).

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React Native (Android + iOS), TypeScript |
| UI Components | shadcn-style component system (`react-native-reusables` + NativeWind/Tailwind) |
| Backend | Spring Boot (Java), Maven |
| Database | PostgreSQL (Supabase free tier initially) |
| Auth | Email/password first; OTP after validation |
| Maps | OpenStreetMap + Leaflet |
| Push Notifications | Firebase Cloud Messaging |
| Hosting | Free-tier hosting (Vercel/Render/Railway) during validation |

Reference: `Vehicle_Assistance_Marketplace_Low_Cost_Business_Model_EN.pdf` for the full business model, functional requirements (FR-01–FR-20) and non-functional requirements (NFR-01–NFR-12).

## 3. Backend Structure (`backend/`)

Modular-by-domain layout under `com.fixgo`, one module per business domain, each with its own `controller` / `service` / `repository` / `entity` / `dto` layers — except where a module owns no database table (see the notes below the tree):

```
backend/
├── src/main/java/com/fixgo/
│   ├── config/           # @Configuration classes (SecurityConfig, CorsConfig, beans)
│   ├── common/
│   │   ├── exception/    # Global exception handling (@RestControllerAdvice)
│   │   ├── util/         # Shared utilities
│   │   └── security/     # JWT filter, token utilities, role-based access
│   ├── auth/             # FR-01 Registration & Login       (no entity/repository)
│   ├── user/             # Customer/provider account data   (owns the User entity)
│   ├── vehicle/          # FR-02 Vehicle Profile
│   ├── provider/         # FR-06, FR-10, FR-16 Provider profile, availability, verification
│   ├── job/              # FR-03–FR-09, FR-12, FR-13 Requests, acceptance, status, cancellation
│   ├── rating/           # FR-14 Rating & Review
│   ├── chat/             # Customer/provider messaging (Phase 2)
│   ├── report/           # FR-17 Fraud/complaint reports
│   ├── notification/     # FR-19 Notifications
│   └── admin/            # FR-18 Admin dashboard            (no entity/repository)
├── src/main/resources/
│   └── db/migration/     # Flyway SQL migrations
├── src/test/
│   ├── java/com/fixgo/   # Test sources (mirrors main structure)
│   └── resources/        # application-test.properties
└── docs/                 # API/architecture notes
```

Two modules deliberately have no `entity` or `repository` package:

- **`auth`** handles registration, login and JWT issuing. It injects `UserRepository` from the `user` module. The `User` entity has exactly one owner — `user` — so that two modules cannot map the same table and fail startup with `DuplicateMappingException`.
- **`admin`** (FR-18) is a view over other domains rather than a domain of its own. `AdminService` composes `UserService`, `JobService` and `ReportService`; suspension state is a column on `users`, not an admin table.

Cross-module design decisions are recorded as ADRs in [backend/docs/](backend/docs/):

| ADR | Decision | Status |
|---|---|---|
| [ADR-001](backend/docs/adr-001-user-and-provider-data-model.md) | User and provider data model — one `users` table plus a 1:1 `provider_profiles` table | Proposed |

## 4. Frontend Structure (`frontend/`)

Feature-first layout so customer, provider and admin flows stay isolated; shared shadcn-style primitives live in `components/ui`.

```
frontend/
├── android/                 # Native Android project
├── ios/                     # Native iOS project
├── src/
│   ├── assets/              # images, fonts, icons
│   ├── components/
│   │   ├── ui/               # shadcn-style primitives (Button, Card, Input, ...)
│   │   └── common/           # Shared composite components
│   ├── features/
│   │   ├── auth/              # screens, components, hooks, services, types
│   │   ├── customer/          # request, vehicle, history
│   │   ├── provider/          # jobs, profile, availability
│   │   ├── admin/              # dashboard, users, reports
│   │   ├── job/
│   │   ├── rating/
│   │   └── notifications/
│   ├── navigation/            # Navigators (stack/tab per role)
│   ├── services/
│   │   ├── api/                # HTTP client, endpoint definitions
│   │   ├── location/           # Location/maps integration
│   │   └── notifications/      # FCM integration
│   ├── store/                  # App state management
│   ├── hooks/                   # Shared hooks
│   ├── lib/                     # Helpers/utilities
│   ├── theme/                   # Design tokens (colors, spacing, typography)
│   ├── types/                    # Shared TypeScript types
│   └── constants/
└── __tests__/
```

## 5. Naming & Contribution Conventions

- Backend packages are named after the business domain, not the technical layer (e.g. `job`, not `services`) — keep new features inside their own domain package with `controller/service/repository/entity/dto` sub-packages.
- Frontend features are grouped by role/domain under `src/features/`; only cross-feature, reusable UI belongs in `src/components`.
- Keep customer, provider and admin flows in separate feature folders even where UI overlaps, per the role separation in the requirements doc (Section 1).
- Follow the phased delivery plan in the spec: build Phase 1 MVP features first (FR-01–FR-14, FR-16, FR-18–FR-20); defer Phase 2 items (OTP, payments, live tracking, advanced chat) until after pilot validation (Section 10 of the spec).
- An entity has exactly one owning module. Other modules reference it through that module's repository or service, never by declaring a second `@Entity` for the same table.
- Database schema is owned by Flyway migrations in `db/migration`, never by Hibernate. Set `spring.jpa.hibernate.ddl-auto=validate` so entities are checked against the migrations at startup and a missing migration fails fast.
- Name migrations `V<yyyyMMdd>_<HHmm>__<description>.sql` (e.g. `V20260828_1430__create_jobs_table.sql`). Sequential `V1`/`V2` numbering collides when two people branch in parallel — both merge cleanly into git and then Flyway refuses to start.
- A migration is immutable once merged. Editing an applied migration changes its checksum and breaks startup for everyone; correct it by adding a new migration.
- Never commit credentials. Reference them as environment variables (`${DB_URL}`, `${DB_USER}`, `${DB_PASSWORD}`) in `application.properties` and keep `.env` out of git (NFR-01).

## 6. Getting Started

Setup steps will be added to [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) as each project is scaffolded.
