# Deployment architecture
Each app has independent source, CI, secrets, hosting, database and release cadence. Launcher deploys Next.js without a DB. Builds validate and generate its public registry. Package consumers pin vendored release artifacts and do not require sibling repositories in CI. A registry outage affects only navigation, never protected app APIs or business data. Stage and verify each release before production. Cloud resources and production DNS are not created by local implementation.

Production hosting is Vercel only. Dockerfiles and compose.local.yaml are strictly local development tooling; the existing local PostgreSQL container is not a production dependency.
