# Configuration (no values)
Launcher: no secrets or database variables. Production registry URL is public. Domain attachment is a hosting setting.

Health: existing DATABASE_URL, AUTH_SECRET and AUTH_URL stay unchanged. Configure AUTH_OWNER_EMAIL (required for owner-only sessions), AUTH_GOOGLE_ID, and AUTH_GOOGLE_SECRET. Google is the only authentication provider; password sign-in/reset/change are removed and there is no password login toggle. Google provider is exposed only when the owner email and both client settings are present. Missing Google configuration is an invalid deployment and must be caught by the release checklist. The local Docker preparation script reads Health APP_CONFIG plus individual variable overrides, requires Google credentials, and uses the supplied owner email. Restart the Health container after regenerating its environment.

Journal: preserve existing server-only APP_CONFIG, including its existing owner allowlist, Google configuration, AUTH_SECRET, AUTH_URL, Neon and private R2 settings. Do not move secrets into NEXT_PUBLIC variables. Shared menu needs no secret configuration.
