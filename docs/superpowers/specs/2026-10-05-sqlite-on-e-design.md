# SQLite on E: Database Conversion Design

## Goal

Move Ruang Rimba's local application database from PostgreSQL to a SQLite file stored with the project on the E: drive, preserving the current local records.

## User intent and constraints

- The website should use a SQLite database file on disk E:.
- Keep the existing administrator accounts, CMS content, settings, and contact requests.
- Keep Prisma as the ORM and keep existing CMS/auth/contact behavior working.
- Keep secrets and the database file out of Git.

## Design

- Use Prisma ORM 7 with `@prisma/adapter-libsql` in embedded local-file mode.
- Configure the local URL as `file:./prisma/ruang-rimba.db`, which resolves inside this project directory on E: in both the current WSL setup and Windows Node.js.
- Add a SQLite-specific migration directory and point `prisma.config.ts` to it. Retain the PostgreSQL migration history as legacy source rather than applying PostgreSQL SQL to SQLite.
- Update the SQLite schema by removing PostgreSQL-only native annotations while preserving model fields, UUID string IDs, relations, indexes, and enum-like values.
- Replace the PostgreSQL advisory-lock email throttle with a SQLite atomic rate-limit record update so concurrent requests continue to respect the existing hourly limit.
- Provide a one-time migration command that reads the existing PostgreSQL records and copies them, including IDs and relations, into the new SQLite database. Do not modify or delete the PostgreSQL source database.
- Require an empty SQLite target for the one-time copy and fail clearly if application data already exists, so a rerun cannot silently merge or overwrite records.
- Ignore the SQLite database file and update seed, local setup, and deployment documentation for a local-file database.

## Data migration behavior

The migration copies users and authentication records, CMS categories and content, gallery, team and conservation data, contact submissions, site settings, FAQs, and audit logs. It preserves IDs, timestamps, status values, password hashes, and relation keys. The script reports per-table counts and stops on an error; it does not delete or mutate the source.

## Verification

- Validate the SQLite Prisma schema and generate the client.
- Apply a clean SQLite migration to a temporary file and run the seed path.
- Run contact persistence and concurrent rate-limit integration tests on SQLite.
- Verify the one-time copy against a temporary SQLite file and compare source/target row counts without printing sensitive values.
- Run lint, typecheck, unit tests, production build, and local HTTP smoke checks.
- Document that production use requires a persistent filesystem and is intended for a single application instance.

## Reference

Prisma 7 SQLite connector: <https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/sqlite>.

## Implementation adjustment

The `better-sqlite3` adapter could not install in the current WSL environment because it has no `make` compiler toolchain. The selected libSQL adapter successfully opened and queried a local SQLite file in this environment, so it is used for the same on-disk database goal without adding a native build requirement.
