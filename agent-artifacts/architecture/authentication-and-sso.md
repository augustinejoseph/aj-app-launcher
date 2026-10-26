# Authentication and SSO
Google is the external identity provider, not a shared application session. Use a proposed aj-personal-platform Google project with separate OAuth clients and exact callback URLs per app. Auth.js runs the OIDC flow server-side and validates provider responses, state, PKCE and nonce. Never parse browser-provided identity claims as authorization.

Health links an existing owner account through a password-confirmed, authenticated, ten-minute one-time intent and verified Google email. Future logins resolve the stored Google subject to the original internal ID. No automatic email-only linking and no user creation from OAuth. Existing password access is retained until verification; an explicit environment switch retires it later. Journal keeps its existing policy. Google consent and app authorization are distinct.

[Auth.js Google provider](https://authjs.dev/reference/core/providers/google) documents callback setup and email_verified. Keycloak is optional future work, not part of this release.
