# Local validation and remaining gates

Implemented locally: public Next.js launcher; validated registry source and JSON Schema; public CORS; pinned React package; Health and Journal header integrations; owner-only Health Google linking; additive migration; documentation and CI workflows.

- Launcher build, TypeScript and seven registry tests pass. Local production HTTP responses for `/` and `/apps.json` returned 200; registry returned `Access-Control-Allow-Origin: *` and JSON content type.
- Journal TypeScript, strict lint, 26 tests and production build pass. Its authentication implementation was not changed.
- Health TypeScript and lint pass with 19 pre-existing warnings. The final full suite passes all 487 tests across 60 files, including runtime registry rejection and real IndexedDB preservation of records, pending writes and drafts. The final production build passes. One existing workout test timed out during simultaneous project builds; it passed in the full isolated rerun.
- Package tarball contents match package source. All three vendored artifacts and their lockfile integrity values match.
- Browser-based visual/mobile and live-provider acceptance have not been performed. Menu keyboard, focus, loading, empty, retry and invalid metadata behavior are tested in JSDOM.
- PostgreSQL integration suite passes all six tests against a separate disposable database in the existing bulkhead-pg Docker container (PostgreSQL 16). It verifies the additive migration preserves fixture user rows, records and password hashes; account linking retains the internal ID; expired intents, unauthorized identities, conflicting links and intent replay are rejected. The active bulkhead database was not modified. Run with `npm run test:google:postgres`; Health's GitHub Actions workflow provides PostgreSQL for this suite. A rehearsal on a representative production database copy remains required.
- No production database, OAuth configuration, cloud resource, DNS record or live deployment has been changed. No password retirement or destructive credential cleanup was performed.

The application URLs remain null/unverified until the owner verifies real origins and readiness. Configure Health's required AUTH_OWNER_EMAIL before deploying its auth changes. Follow the Health migration runbook for backup, schema/ledger verification, database rehearsal, Google linking and acceptance before retirement.

## Local Docker execution
Docker is local-only; production hosting remains Vercel. Eight registry tests now pass, including explicit loopback-only HTTP validation. Dockerized launcher, Health and Journal were started successfully with the existing bulkhead-pg container. Health's local additive migration was applied after backup/restore verification; all pre-existing table fingerprints and user IDs match both the restored backup and the pre-migration snapshot. Journal uses an independently initialized local database. See local-docker.md for URLs and smoke-check results. Health Google client credentials and localhost OAuth callbacks still require configuration before live linking can be tested.
