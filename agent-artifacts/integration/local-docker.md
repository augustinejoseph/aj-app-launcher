# Local Docker development; Vercel production

Docker is exclusively for local development. Production remains separate Vercel projects with their existing hosted databases and configuration. Dockerfiles are named Dockerfile.local and are not part of Vercel deployment.

## Services
- Launcher: http://localhost:3002
- Health: http://localhost:3000
- Journal: http://localhost:3001
- PostgreSQL: existing bulkhead-pg container, host port 5433. Apps reach it as postgres:5432 on the aj-local Docker network.

Health retains its existing bulkhead database and both user accounts. Only the selected owner is allowed to sign in. Journal uses a separate aj_journal_local database; its hosted Neon configuration is not used inside Docker. The launcher requires no database.

## Start and stop
Use Node 24 on the host to prepare ignored configuration:

```sh
cp -n .env.example .env
node scripts/prepare-local-docker.mjs <existing-health-owner-email>
docker compose -f compose.local.yaml up -d --build
```

The existing bulkhead-pg container must be running and attached to the external aj-local network with alias postgres. Initial setup creates that network and attaches the container without replacing its data volume. The local Journal database must exist and be migrated once with `docker compose -f compose.local.yaml run --rm journal npm run db:migrate`.

Stop apps using `docker compose -f compose.local.yaml down`. This leaves PostgreSQL and all database data intact. Do not use volume deletion commands to fix application issues. After changing package lockfiles, recreate the app's node_modules volume only after stopping its container, or run npm ci inside the relevant container; database volumes are unrelated.

The generated .local directory contains private environment files. It is ignored by Git and excluded from Docker build contexts. Application source is mounted for hot reload; node_modules and .next use container volumes. The launcher registry lives in `.env` as `AJ_APPS_CONFIG`; preparation updates it with localhost app URLs and enables local development. Health and Journal source environment files remain unchanged. After editing launcher `.env`, recreate the launcher with `docker compose -f compose.local.yaml up -d --force-recreate launcher`. Local HTTP registry entries require an explicit localhost-only validation opt-in; production remains HTTPS-only.

## Authentication and services
Health Google client credentials are not configured locally yet; existing owner password login remains available. Add Health's own OAuth settings to its local environment, register http://localhost:3000/api/auth/callback/google, regenerate Docker configuration and recreate the Health container before linking. Journal's Google client must permit http://localhost:3001/api/auth/callback/google. Google consent/callback configuration is external and not automatically changed.

Journal retains its configured Google, R2 and AI service settings; only its database and app origin are overridden. Merely starting the container does not run recording, AI or storage operations. Live authentication and media flows still require correct provider configuration and localhost CORS.

## Verified setup on 2026-10-26
All three app containers are running. Launcher and registry return 200; Health sign-in returns 200 and /home redirects unauthenticated requests to sign-in; Journal returns 200 and its protected entries API returns 401 without a session. The local registry points to localhost:3000 and localhost:3001 and allows public CORS.

Health migration 0014 was applied locally after saving .local/health-before-google.dump and verifying its restoration. Existing table fingerprints and both original user IDs match before and after migration, and match the restored backup. The temporary restore-check database was removed; the backup is retained. No hosted database or Vercel configuration was modified.

The first container build exhausted available disk space. Approved npm cache cleanup and Docker restart recovered the environment. Database availability and record preservation were verified afterward. Local images now remove npm download caches during construction.
