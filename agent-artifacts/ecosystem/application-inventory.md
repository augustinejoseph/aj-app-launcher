# Application inventory
| App | Repository | Stack | Data | Authentication | Deployment / origin |
|---|---|---|---|---|---|
| Launcher | aj-app-launcher (new local Git repo) | Next.js / React / TypeScript | Public Git registry; no DB | None | Vercel proposed; apps.ajoseph.dev unverified |
| Health | https://github.com/augustinejoseph/aj-health | Next.js product in aj-health-app; Astro marketing | Hosted Neon reported by owner; Dexie offline data; deployment DB uninspected | Passwords during transition, linked Google owner only | Vercel config exists; live origin unverified |
| Journal | https://github.com/augustinejoseph/aj-journal | Next.js / Auth.js / Drizzle | Neon / private R2 configured by app | Existing owner-only Google | Live origin unverified |

Neither app is marked available in the public registry until its actual origin and readiness are verified. No Ledger or Focus entries. Existing Health and Journal user data is not inspected or copied into the launcher. App-specific models, APIs, migrations, features and operational limits stay documented in their own agent-artifacts hubs.
