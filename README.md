# AJ applications
Public Next.js directory and independently versioned React launcher. Health and Journal retain separate repositories, deployments, databases, and owner-only authentication. No launcher login or database.

## Development
Use Node 24. Copy `.env.example` to `.env` and edit `AJ_APPS_CONFIG`, a single JSON registry value. Run `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, then `npm run dev`. Build validates `AJ_APPS_CONFIG`. The page and `/apps.json` endpoint read this server environment value. Restart the server or recreate Docker containers after environment changes. Set the same variable in production hosting; the JSON is public and must contain no secrets.

The initial entries are unverified and intentionally have no URLs. Verify the real app deployment and owner login before setting its HTTPS URL and `status: available`. Proposed domains are not evidence of deployment.

## Package releases
The package lives in `packages/app-launcher`. Run `npm pack ./packages/app-launcher --pack-destination ./vendor`. Copy the resulting versioned tarball into each consumer's `vendor/`, pin it using `file:vendor/<filename>`, and run `npm install`. Commit the package source, tarball and lockfiles. Consumers need `transpilePackages: ['@ajoseph/app-launcher']` in Next config because this release ships TypeScript source. Other React build tools must transpile this dependency. This avoids a private package registry; release tarballs can later be hosted in GitHub Releases.

Bump the package version for changes; never overwrite a released version. Test the new artifact in each app and retain the old tarball for rollback. `AppLauncher` accepts `currentApp: string` and optional `registryUrl: string`, defaulting to `https://apps.ajoseph.dev/apps.json`.

## Deploy
Import this independent repository into Vercel as Next.js with Node 24 and build command `npm run build`. Attach `apps.ajoseph.dev` only after domain ownership and DNS are confirmed. No production resources have been provisioned. See [documentation](agent-artifacts/README.md) and [release checklist](agent-artifacts/integration/release-checklist.md).

## Docker for local development

All three Next.js apps can run in Docker against the existing local PostgreSQL container. Production hosting remains Vercel. See [local Docker setup](agent-artifacts/integration/local-docker.md).
