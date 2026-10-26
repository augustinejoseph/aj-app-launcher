# Configuration (no values)
Launcher: no secrets or database variables. Production registry URL is public. Domain attachment is a hosting setting.

Health: existing DATABASE_URL, AUTH_SECRET and AUTH_URL stay unchanged. Add AUTH_OWNER_EMAIL (required for owner-only sessions and password login), AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET. Leave AUTH_PASSWORD_LOGIN_DISABLED unset or false until owner acceptance, then explicitly set true. Google provider is exposed only when the owner email and both client settings are present. Fail closed if owner email is missing; configure it before deploying auth changes. Missing Google configuration with password retirement is an invalid deployment and must be caught by the release checklist.

Journal: preserve existing server-only APP_CONFIG, including its existing owner allowlist, Google configuration, AUTH_SECRET, AUTH_URL, Neon and private R2 settings. Do not move secrets into NEXT_PUBLIC variables. Shared menu needs no secret configuration.
