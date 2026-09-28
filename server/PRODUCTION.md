# Backend production runbook

## Release gate

1. Run `npm ci`, `npm run check`, and `npm audit --audit-level=high` in CI.
2. Set `NODE_ENV=production` and every variable documented in `.env.example`.
3. Create a private, signed Cloudinary upload preset that accepts only JPG/JPEG/PNG/WebP/AVIF images. The frontend must submit `allowed_formats` and `upload_preset` returned by the signature endpoint together with the other signed fields.
4. Run `npm run db:create-indexes` as a controlled release step. Production application startup intentionally disables automatic index creation.
5. Back up MongoDB and verify that a restore can be completed before deploying schema or content changes.
6. Deploy one immutable revision, check `/api/v1/health/live`, then check `/api/v1/health` for database readiness.
7. Monitor JSON logs, 5xx rate, latency, login throttling, Cloudinary usage, and MongoDB connection saturation.

## Security and secrets

- Store MongoDB, JWT, admin bootstrap, and Cloudinary secrets in the hosting platform secret manager; never in source control.
- Rotate the JWT secret and bootstrap password after suspected exposure. A JWT secret rotation signs every user out.
- Set `TRUST_PROXY_HOPS` to the exact number of trusted reverse proxies. Do not expose the Node process directly when this value is non-zero.
- Cookie-authenticated mutation requests must include an allowed `Origin` header. Cross-site browser requests are rejected.
- Editors may create and edit CMS content; only administrators may delete it.
- The direct-browser upload flow checks 10 MB in the client and rejects oversized metadata before CMS persistence, but Cloudinary upload presets do not enforce a hard file-size limit. If untrusted users are ever allowed to upload, replace this flow with a size-limited backend upload proxy.

## Scale note

The bundled rate limiter uses process memory. Run a single API instance initially. Before horizontal scaling, configure a shared rate-limit store supported by the deployment platform and test limits across instances.

## Backup and rollback

- Use automated encrypted MongoDB backups with retention appropriate to the organization, plus a manual snapshot before each data migration.
- Test restore into a non-production database on a schedule; an untested backup is not a recovery plan.
- Keep the previous application revision deployable. Roll back the application first when error rate or latency materially regresses; restore data only when a migration changed it incompatibly.
- Cloudinary cleanup is best-effort. Periodically reconcile application `publicId` values against the application folder to find orphaned assets.

## Incident checks

1. Confirm liveness and readiness separately.
2. Search logs by `requestId` and inspect recent `AdminAuditLog` entries.
3. Check MongoDB pool/connection health and Cloudinary quota.
4. If a release caused the issue, roll back before debugging further.
