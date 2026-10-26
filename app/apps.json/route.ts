import { validateRegistry } from "@ajoseph/app-launcher/registry";

export const dynamic = "force-dynamic";

export function GET() {
  const local = process.env.NODE_ENV === "development" && process.env.AJ_LOCAL_DEVELOPMENT === "true";
  const registry = validateRegistry(JSON.parse(process.env.AJ_APPS_CONFIG || "null"), { allowLocalhost: local });
  return Response.json(registry, { headers: { "Cache-Control": "no-store" } });
}
