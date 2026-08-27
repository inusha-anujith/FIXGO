# ADR-001: User and Provider Data Model

**Status:** Proposed — requires team approval before any migration is written.

## Context

The package structure gives `user` and `provider` separate modules, but does not
say whether a provider is:

- a **separate entity** with its own credentials and identity, or
- a **role on `User`** with an attached profile.

This is unresolved and blocks work in several places:

- `auth` (FR-01) must know which table(s) to authenticate against.
- `job` (FR-03–FR-09) needs `customer_id` and `provider_id` columns and cannot
  declare foreign keys without knowing the target table.
- `admin` (FR-18) must suspend both customers and providers through one mechanism.
- `rating` (FR-14) and `notification` (FR-19) both reference provider identity.

Relevant requirements: FR-01 (customer/provider accounts), FR-04 (service
categories), FR-06 (availability), FR-10 (provider profile, verification,
rating), FR-16 (admin verifies providers), FR-18 (suspensions), NFR-01
(role-based access), NFR-02 (do not expose contact details), NFR-03 (only
verified providers accept jobs).

## Decision

**One `users` table holding identity and credentials for every account, plus a
`provider_profiles` table in a 1:1 relationship with it, holding provider-only
attributes.**

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` PK | Non-sequential: IDs travel in URLs and notifications (NFR-02) |
| `email` | `VARCHAR` UNIQUE NOT NULL | Login identifier |
| `password_hash` | `VARCHAR` NOT NULL | BCrypt (NFR-01). Never leaves the service layer |
| `full_name` | `VARCHAR` NOT NULL | |
| `phone` | `VARCHAR` | Disclosed only after job acceptance (NFR-02, FR-11) |
| `role` | `VARCHAR` NOT NULL | `CUSTOMER` \| `PROVIDER` \| `ADMIN`, `CHECK` constrained |
| `status` | `VARCHAR` NOT NULL | `ACTIVE` \| `SUSPENDED`, default `ACTIVE` (FR-18) |
| `created_at` | `TIMESTAMPTZ` NOT NULL | NFR-09 |
| `updated_at` | `TIMESTAMPTZ` NOT NULL | NFR-09 |

### `provider_profiles`

| Column | Type | Notes |
|---|---|---|
| `user_id` | `UUID` PK, FK → `users(id)` | PK *is* the FK — enforces 1:1 without a surrogate key |
| `business_name` | `VARCHAR` | |
| `verification_status` | `VARCHAR` NOT NULL | `PENDING` \| `VERIFIED` \| `REJECTED`, default `PENDING` (FR-16) |
| `availability` | `VARCHAR` NOT NULL | `AVAILABLE` \| `BUSY` \| `OFFLINE`, default `OFFLINE` (FR-06) |
| `base_latitude` | `NUMERIC(9,6)` | For nearby-job filtering (FR-05) |
| `base_longitude` | `NUMERIC(9,6)` | |
| `rating_average` | `NUMERIC(2,1)` | Denormalised from `ratings` (FR-10) |
| `rating_count` | `INTEGER` NOT NULL | Default 0 |
| `created_at` / `updated_at` | `TIMESTAMPTZ` NOT NULL | NFR-09 |

### `provider_service_types`

A provider offers several of the FR-04 categories, so service types are a
separate table rather than a column:

| Column | Type |
|---|---|
| `provider_user_id` | `UUID` FK → `provider_profiles(user_id)` |
| `service_type` | `VARCHAR` — `MECHANIC` \| `TOWING` \| `BATTERY` \| `TYRE` \| `FUEL` |

Primary key `(provider_user_id, service_type)`.

## Consequences

**For `job` (unblocks the main open question):** both `jobs.customer_id` and
`jobs.provider_id` reference `users(id)`. `provider_id` is nullable — it is
`NULL` until a provider accepts (FR-07). There is no separate `providers` table
to point at.

**For NFR-03** ("only verified providers can accept public jobs"): the accept
operation joins `provider_profiles` and requires
`verification_status = 'VERIFIED'` and `status = 'ACTIVE'` on the user.

**For `auth`:** one table to authenticate against, one query, one login flow.

**For `admin` (FR-18):** suspension is `users.status`, so one code path suspends
customers and providers alike.

**Module ownership:** the `user` module owns the `User` entity; the `provider`
module owns `ProviderProfile` and `ProviderServiceType`. Neither declares an
entity for the other's table.

**Accepted limitation:** a single `role` column means one account cannot be both
customer and provider — a mechanic who also owns a vehicle would need two
accounts. This is acceptable for the pilot. If it becomes a real complaint, the
migration path is a `user_roles` join table; nothing else in this design changes.

## Alternatives rejected

**A separate `providers` table with its own email and password.** Duplicates
credentials and hashing across two tables, forces `auth` to try two login paths
and two token shapes, and gives admin two suspension mechanisms to keep in sync.

**A single `users` table with nullable provider columns.** Every provider column
would be `NULL` for customers, so none of them could be `NOT NULL`, and the
FR-16 verification rules could not be expressed as database constraints.

## Interim note for parallel work

Until the `users` migration is merged, other modules may declare `UUID` columns
**without** foreign key constraints and add the FKs in a later migration. This
keeps `job`, `rating` and `notification` unblocked while `user` is in progress.
