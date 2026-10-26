# Staged release
- [ ] Verify Health and Journal production origins and readiness; update registry only with evidence.
- [ ] Create remote aj-app-launcher repository and push reviewed local source; configure independent CI and Vercel.
- [ ] Confirm domain ownership; authorize and apply supplied DNS records; verify TLS and public registry CORS.
- [ ] Release launcher, then menu integrations; test app access remains protected.
- [ ] Follow Health's migration runbook: owner configuration, reviewed schema/ledger, recoverable Neon copy, device sync, migration rehearsal, additive migration, Google linking, separate-browser verification.
- [ ] Obtain owner acceptance before enabling AUTH_PASSWORD_LOGIN_DISABLED=true. Keep hashes and backup through rollback window.
- [ ] Verify Journal owner-only access is unchanged.

No production migration, OAuth client creation, DNS change, deployment or password retirement has been performed by local source changes. Live OAuth, representative production data comparison and physical-device acceptance require the owner's real environment.
