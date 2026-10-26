export const statuses = [
  "available",
  "development",
  "planned",
  "unverified",
  "retired",
];
export const icons = ["heart-pulse", "book-open"];
export function validateRegistry(value, { allowLocalhost = false } = {}) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.apps))
    throw new Error("Unsupported registry");
  const seen = new Set();
  for (const app of value.apps) {
    if (
      !app ||
      typeof app.id !== "string" ||
      !/^[a-z][a-z0-9-]*$/.test(app.id) ||
      seen.has(app.id)
    )
      throw new Error("Invalid or duplicate app ID");
    seen.add(app.id);
    for (const field of ["name", "description", "repository"])
      if (typeof app[field] !== "string" || !app[field].trim())
        throw new Error(`Missing ${field}`);
    if (
      !/^aj-[a-z0-9-]+$/.test(app.repository) ||
      !statuses.includes(app.status) ||
      !icons.includes(app.icon) ||
      typeof app.enabled !== "boolean"
    )
      throw new Error("Invalid app metadata");
    if (app.url !== null) {
      if (typeof app.url !== "string") throw new Error("Invalid app URL");
      const url = new URL(app.url);
      if (
        (url.protocol !== "https:" && !(allowLocalhost && url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) ||
        url.username ||
        url.password ||
        url.hash ||
        url.search
      )
        throw new Error("Invalid HTTPS app URL");
    }
    if (app.status === "available" && !app.url)
      throw new Error("Available apps require a verified URL");
  }
  return value;
}
