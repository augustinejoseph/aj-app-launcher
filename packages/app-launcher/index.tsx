"use client";
import { useEffect, useId, useRef, useState } from "react";
import { validateRegistry, type Registry, type AppEntry } from "./registry.js";
export const DEFAULT_REGISTRY_URL = "https://apps.ajoseph.dev/apps.json";
export function AppIcon({ icon }: { icon: AppEntry["icon"] }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      {icon === "heart-pulse" ? (
        <>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          <path d="M3 12h5l2-4 4 8 2-4h5" />
        </>
      ) : (
        <>
          <path d="M12 5v16M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z" />
        </>
      )}
    </svg>
  );
}
export function AppLauncher({
  currentApp,
  registryUrl = DEFAULT_REGISTRY_URL,
  allowLocalhost = false,
}: {
  currentApp: string;
  registryUrl?: string;
  allowLocalhost?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setError(false);
    setRegistry(null);
    const timer = setTimeout(() => controller.abort(), 10000);
    let active = true;
    fetch(registryUrl, { credentials: "omit", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Registry unavailable");
        return response.json();
      })
      .then((value) => {
        const checked = validateRegistry(value, { allowLocalhost });
        if (active) setRegistry(checked);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => clearTimeout(timer));
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, registryUrl, attempt, allowLocalhost]);
  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const apps =
    registry?.apps.filter((app) => app.enabled && app.status !== "retired") ??
    [];
  return (
    <div
      ref={root}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget as Node)
        )
          setOpen(false);
      }}
      style={{
        position: "relative",
        display: "inline-block",
        color: "inherit",
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          button.current?.focus();
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (!open) {
            setOpen(true);
            return;
          }
          const items = Array.from(
            panel.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
          );
          const index = items.indexOf(document.activeElement as HTMLElement);
          const next =
            index < 0
              ? event.key === "ArrowDown"
                ? 0
                : items.length - 1
              : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
                items.length;
          items[next]?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-label="Open application directory"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        style={{
          minWidth: 44,
          minHeight: 44,
          border: "1px solid currentColor",
          borderRadius: 12,
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          {[3, 10, 17].flatMap((x) =>
            [3, 10, 17].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
            )),
          )}
        </svg>
      </button>
      {open && (
        <div
          ref={panel}
          id={id}
          role="region"
          aria-label="Applications"
          tabIndex={-1}
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: "min(320px, calc(100vw - 32px))",
            padding: 16,
            borderRadius: 16,
            background: "var(--surface, var(--paper, #181a20))",
            color: "var(--ink, #f4f4f5)",
            border: "1px solid var(--line, #555)",
            boxShadow: "0 16px 48px #0006",
            zIndex: 1000,
          }}
        >
          {!registry && !error && <p role="status">Loading applications…</p>}
          {error && (
            <div role="alert">
              <p>Application directory unavailable.</p>
              <button type="button" onClick={() => setAttempt(attempt + 1)}>
                Try again
              </button>
            </div>
          )}
          {registry && !apps.length && <p>No applications listed.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {apps.map((app) => {
              const content = <>
                <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 16,
                  background: app.icon === "heart-pulse" ? "#e8eddf" : "#eee7db",
                  color: app.icon === "heart-pulse" ? "#526747" : "#82735d" }}><AppIcon icon={app.icon} /></span>
                <span>{app.name}</span>
              </>;
              const style = { display: "flex", flexDirection: "column" as const, alignItems: "center",
                justifyContent: "center", gap: 12, padding: "20px 8px", borderRadius: 12, minHeight: 116,
                color: "inherit", textDecoration: "none", fontSize: 13, fontWeight: 500, textAlign: "center" as const,
                background: currentApp === app.id ? "color-mix(in srgb, currentColor 6%, transparent)" : "transparent" };
              return app.status === "available" && app.url ? (
                <a key={app.id} href={app.url} style={style} aria-current={currentApp === app.id ? "page" : undefined}>{content}</a>
              ) : <div key={app.id} style={style} aria-disabled="true">{content}</div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
