# Staged release
- [ ] Verify Health and Journal production origins and readiness; update registry only with evidence.
- [ ] Create remote aj-app-launcher repository and push reviewed local source; configure independent CI and Vercel.
- [ ] Confirm domain ownership; authorize and apply supplied DNS records; verify TLS and public registry CORS.
- [ ] Release launcher, then menu integrations; test app access remains protected.
- [ ] Follow Health's migration runbook: owner configuration, reviewed schema/ledger, recoverable Neon copy, device sync, migration rehearsal, additive migration, Google linking, separate-browser verification.
- [ ] Confirm Google is the sole deployed Health provider and verify owner login in a separate browser before applying credential cleanup migration 0015. Retain a restorable backup.
- [ ] Verify Journal owner-only access is unchanged.

No production migration, OAuth client creation, DNS change, deployment or password retirement has been performed by local source changes. Live OAuth, representative production data comparison and physical-device acceptance require the owner's real environment.
