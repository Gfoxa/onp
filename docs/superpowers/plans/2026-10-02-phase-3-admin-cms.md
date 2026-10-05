# Phase 3 Admin CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PostgreSQL-backed content management with administrator-only access while preserving the public site's verified/demo boundaries.

**Architecture:** Prisma 7 with the PostgreSQL driver adapter owns persistence. Auth.js Credentials authenticates seeded administrator accounts with hashed passwords and JWT sessions; protected server layouts and every server action verify the administrator role. Typed server services and Zod schemas back focused CRUD screens. Public pages read published database content with existing demo content as the empty-database fallback.

**Tech Stack:** Next.js 16 App Router, TypeScript, PostgreSQL, Prisma ORM 7, Auth.js, Zod, bcryptjs, Node test runner via tsx.

**Spec:** Phase 3 requirements from the user's website brief.

## Global Constraints

- Do not invent organization facts, contact details, team members, partners, certifications, testimonials, or conservation metrics.
- Use UUID primary keys and `createdAt` / `updatedAt` fields where appropriate.
- All admin reads and writes are authorized on the server; no public signup route.
- Validate all submitted content with Zod and record administrative mutations in `AuditLog`.
- Keep Phase 4 contact submission workflows and Phase 5 production hardening out of scope.

## Review Focus

- Unauthenticated requests to an admin page or action are redirected/rejected.
- An authenticated non-admin role cannot access or mutate CMS data.
- Duplicate or malformed slugs fail validation without changing existing records.
- An unconfigured database uses clearly marked demo content on public pages, while admin pages show an actionable configuration error.
- Draft/unpublished content never appears in public listings, metadata, or sitemap entries.

---

### Task 1: Validation and authorization primitives

**Files:** `src/lib/slug.ts`, `src/lib/slug.test.ts`, `src/server/cms/validation.ts`, `src/server/cms/validation.test.ts`, `src/server/auth/roles.ts`, `src/server/auth/roles.test.ts`; modify package scripts and dependencies.

**Interfaces:** `slugify(value: string): string`; exported Zod schemas for program, article, gallery image, team member, conservation project, and site settings; `isAdminRole(role: unknown): boolean`.

- [x] Write tests for Indonesian/accented text slug generation, blank input, representative entity validation, and administrator-role checks.
- [x] Run the targeted tests and confirm expected failures.
- [x] Implement the pure helpers and schemas; keep database and framework imports out of these modules.
- [x] Run targeted tests and the full suite. Changes remain uncommitted on the feature branch.

### Task 2: PostgreSQL schema and seed setup

**Files:** `prisma/schema.prisma`, `prisma.config.ts`, `prisma/seed.ts`, `prisma/migrations/`, `src/lib/db/prisma.ts`, `compose.yaml`, `.env.example`, `package.json`, `README.md`.

**Interfaces:** Prisma models `User`, `Program`, `ProgramCategory`, `GalleryImage`, `GalleryCategory`, `Article`, `ArticleCategory`, `TeamMember`, `ConservationProject`, `ContactSubmission`, `SiteSetting`, `FAQ`, and `AuditLog`; singleton `prisma` client.

- [x] Define UUID-backed models, relations, enums, timestamps, slug uniqueness, and query indexes.
- [x] Add a local PostgreSQL service configuration and environment placeholders without committing secrets.
- [x] Seed one administrator only from `ADMIN_EMAIL` and `ADMIN_PASSWORD`, hashing the password; seed clearly marked demo content only when explicitly enabled.
- [x] Validate the schema and generate the Prisma client.
- [x] Create/apply the initial migration and verify seed behavior against a separate local PostgreSQL database.

### Task 3: Auth.js login and protected admin shell

**Files:** `src/lib/auth/config.ts`, `src/lib/auth/index.ts`, `src/lib/auth/types.d.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/admin/login/page.tsx`, `src/components/admin/login-form.tsx`, `src/app/admin/(dashboard)/layout.tsx`, `src/server/auth/require-admin.ts`, `src/components/admin/admin-navigation.tsx`.

**Interfaces:** `auth()`, `signIn`, `handlers`, `requireAdmin(): Promise<AdminSession>`.

- [x] Add Auth.js Credentials authentication against administrator records and password hashes.
- [x] Test that invalid credentials and non-admin users are rejected; valid seeded admin records receive the ADMIN role in their session.
- [x] Add login UI and server-protected dashboard layout; ensure each server action also calls `requireAdmin`.
- [ ] Verify a valid authenticated browser/HTTP session end to end. Unauthenticated redirect is verified; a manually assembled callback smoke request returned `CredentialsSignin`, while the credential verifier and Auth.js core flow both pass.

### Task 4: CMS services and audited server actions

**Files:** `src/server/cms/*`, `src/app/admin/(dashboard)/{program,artikel,galeri,tim,konservasi,settings}/actions.ts`.

**Interfaces:** Typed list/create/update/archive services and server actions for each requested content type; mutation audit records store actor, operation, entity, and entity ID.

- [x] Write tests for slug generation, field validation, and publish-state handling.
- [x] Implement administrator-only CRUD, soft archive/unpublish, input validation, and audit logging.
- [x] Revalidate the affected admin and public routes after successful mutations.
- [x] Run the full suite and verify local PostgreSQL migration, connection, and seed behavior.

### Task 5: Admin content screens

**Files:** `src/app/admin/(dashboard)/page.tsx`, route pages for `program`, `artikel`, `galeri`, `tim`, `konservasi`, and `settings`; reusable admin form/list components under `src/components/admin/`.

**Interfaces:** Server-rendered list views and validated create/edit forms backed by Task 4 actions.

- [x] Add overview counts and links to each content area.
- [x] Add create, edit, publish/unpublish, and archive controls for each requested entity.
- [x] Add settings fields for organization name, description, contact, address, WhatsApp, social URLs, and SEO metadata.
- [x] Use labeled forms, visible validation feedback, and server-side role protection; keyboard paths remain available through native controls.

### Task 6: Published content integration and docs

**Files:** public program/article/gallery/team/conservation/contact/sitemap pages, `src/server/cms/public-content.ts`, `README.md`.

**Interfaces:** Typed public-content readers return only published rows and use Phase 2 demo fixtures when the database has no published replacement content.

- [x] Connect published CMS data to public listings/details and settings; keep draft content private. Contact submission persistence is Phase 4.
- [x] Make sitemap include published database slugs and omit drafts.
- [x] Document local database startup, migration, admin bootstrap, seed behavior, and CMS editing.
- [x] Run lint, typecheck, tests, build, Prisma validation, and unauthenticated route smoke checks.
