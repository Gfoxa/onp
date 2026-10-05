# Phase 4 — Contact & Conversion

## Goal

Store visitor inquiries safely, give admins a useful inbox, and make the configured WhatsApp route available throughout the public site.

## Implementation sequence

1. Add failing tests for Indonesian contact-form validation, form normalization, honeypot handling, and email-based rate-limit decisions.
2. Implement Zod schemas and a server-only contact service that persists `ContactSubmission` records, throttles repeat requests, and audits admin status changes.
3. Add a progressive-enhancement contact form using a Next.js Server Action; support program-prefill from program detail links and show accessible validation/success states.
4. Add admin inbox list, status workflow, and safe contact links/details; include new and in-progress counts on dashboard.
5. Add a configured, accessible floating WhatsApp action and use one URL builder for WhatsApp CTAs and program-specific messages.
6. Add the required PostgreSQL index/migration if the current schema needs it, document Phase 4, then run test, lint, typecheck, build, migration, and localhost smoke checks.

## Safety and product constraints

- No email, phone, address, or WhatsApp number is invented; all outward links remain absent when settings are unconfigured.
- Public submissions accept only allowlisted fields, validate on the server, use the framework Server Action origin check, and include a hidden honeypot plus an email-based database throttle.
- Admin status mutation re-checks the administrator session and writes an audit record.
- The work is isolated on `feat/phase-4-contact-conversion`; Phase 3 remote branch remains untouched.
