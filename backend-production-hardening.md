# Backend Production Hardening

## Goal
Harden the existing Express/MongoDB CMS for production without adding Era/Battalion publication state or changing the frontend API unnecessarily.

## Tasks
- [x] Fix production proxy/rate-limit bypass and validate security-sensitive environment values. → Verify hostile `Host: localhost` requests remain limited.
- [x] Add same-origin/CSRF protection for cookie-authenticated mutations. → Verify trusted origins pass and untrusted origins receive 403.
- [x] Remove request-time historical seeding and unsafe/dead reset code. → Verify public reads never write to MongoDB.
- [x] Harden authentication/RBAC and add admin mutation audit records. → Verify editor/admin permissions and audit payloads.
- [x] Constrain Cloudinary uploads and validate persisted Cloudinary metadata. → Verify invalid format/size/host inputs fail.
- [x] Add production observability, DB readiness, request IDs, and bounded graceful shutdown. → Verify logs/health responses and shutdown behavior.
- [x] Bound expensive queries and validate Era/Battalion admin search. → Verify deep pages and oversized searches fail validation.
- [x] Add CI-quality scripts/tests and operational deployment guidance. → Verify syntax checks and the complete test suite pass.
- [x] Run final static/runtime/security verification and review the diff. → Verify no client files or API contract regressions.

## Done When
- [x] All production-hardening tests pass and the server code loads cleanly.
- [x] No new runtime dependency is required.
- [x] Era and Battalion schemas remain without draft/published state, per request.

## Notes
- Backend-only scope: `server/**`, plus this required root plan file.
- Prefer backward-compatible response additions; document any intentional behavior change.
