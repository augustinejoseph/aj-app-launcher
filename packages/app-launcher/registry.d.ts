export type AppStatus =
  "available" | "development" | "planned" | "unverified" | "retired";
export type AppEntry = {
  id: string;
  name: string;
  description: string;
  repository: string;
  icon: "heart-pulse" | "book-open";
  status: AppStatus;
  enabled: boolean;
  url: string | null;
};
export type Registry = { schemaVersion: 1; apps: AppEntry[] };
export const statuses: AppStatus[];
export const icons: string[];
export function validateRegistry(value: unknown, options?: { allowLocalhost?: boolean }): Registry;
