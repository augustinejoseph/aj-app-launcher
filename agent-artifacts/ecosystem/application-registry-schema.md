# Registry v1
Root object: `schemaVersion` must equal 1; `apps` is an array. Runtime and build validation use the same package validator; the JSON Schema is `apps.schema.json`.

| Field | Meaning |
|---|---|
| id | Unique stable lowercase identifier, beginning with a letter; digits and hyphens allowed |
| name | Nonempty public display name |
| description | Nonempty short public description |
| repository | Repository basename matching aj-<name>, not an invented remote URL |
| icon | heart-pulse or book-open; expand validator and renderer together |
| status | available, development, planned, unverified, retired |
| enabled | Boolean; disabled entries do not render |
| url | HTTPS URL or null; no credentials, fragments or query strings; available requires a verified URL |

Only available apps with URLs are clickable. Unverified means deployment readiness or origin is unknown. Retired apps remain in source inventory but do not render. No private metadata belongs here. All registry bytes are publicly readable, including disabled entries. Source is root apps.json in Git; scripts/validate.mjs creates the deployed public/apps.json during build. Never use raw GitHub as runtime API. Adding a URL requires a human verification record in the inventory.
