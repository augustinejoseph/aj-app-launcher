"use client";
import { useEffect, useId, useRef, useState } from "react";
import { validateRegistry, type Registry, type AppEntry } from "./registry.js";
export const DEFAULT_REGISTRY_URL = "https://apps.ajoseph.dev/apps.json";
export function AppIcon({ icon }: { icon: AppEntry["icon"] }) {
  const health = icon === "heart-pulse";
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" rx="14" fill={health ? "#e6eddf" : "#f1e6d5"} />
      <rect x="1.5" y="1.5" width="45" height="45" rx="13.5" stroke={health ? "#526747" : "#916b44"} strokeOpacity=".14" />
      {health ? <>
        <path d="M24 35s-13-7.6-13-15a7 7 0 0 1 13-3.6A7 7 0 0 1 37 20c0 7.4-13 15-13 15Z" fill="#526747" />
        <path d="M14 24h6l2.5-6 4 12 2.5-6h5" stroke="#f5f8ef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="12" r="3" fill="#a8ba85" />
      </> : <>
        <path d="M14 11h18a3 3 0 0 1 3 3v22H16a4 4 0 0 1-4-4V13a2 2 0 0 1 2-2Z" fill="#916b44" />
        <path d="M18 11h14a3 3 0 0 1 3 3v18H18V11Z" fill="#fff9ed" />
        <path d="M18 32h17v4H16a2 2 0 0 1 0-4h2Z" fill="#d8c3a1" />
        <path d="M23 19h7m-7 5h5" stroke="#b99a6d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M29 11v9l-2-1.5-2 1.5v-9" fill="#b27052" />
      </>}
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
      <style>{`
        .aj-spaces-trigger:hover { box-shadow: 0 2px 8px #17211012; }
        .aj-spaces-trigger:focus-visible, .aj-spaces-panel a:focus-visible, .aj-spaces-panel button:focus-visible { outline: 2px solid #526747; outline-offset: 3px; }
        .aj-spaces-panel a.aj-space:hover { background: #eef1e7 !important; }
        .aj-spaces-panel a.aj-space:hover svg { transform: translateY(-2px); }
        .aj-space svg { transition: transform .18s ease; }
        .aj-spaces-panel, .aj-spaces-panel * { box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) { .aj-space svg { transition: none; } }
      `}</style>
      <button
        className="aj-spaces-trigger"
        ref={button}
        type="button"
        aria-label="Open application directory"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        style={{
          minWidth: 88,
          minHeight: 44,
          border: "1px solid color-mix(in srgb, currentColor 18%, transparent)",
          borderRadius: 12,
          background: open ? "color-mix(in srgb, currentColor 10%, transparent)" : "color-mix(in srgb, currentColor 4%, transparent)",
          color: "inherit",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          padding: "0 13px",
          fontFamily: "inherit",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="6" height="6" rx="2" />
          <rect x="12" y="2" width="6" height="6" rx="2" opacity=".5" />
          <rect x="2" y="12" width="6" height="6" rx="2" opacity=".5" />
          <rect x="12" y="12" width="6" height="6" rx="2" />
        </svg>
        <span>Apps</span>
      </button>
      {open && (
        <div
          className="aj-spaces-panel"
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
            padding: 12,
            borderRadius: 22,
            background: "#fffdf8",
            color: "#292d28",
            border: "1px solid #e1e3d8",
            boxShadow: "0 20px 60px #17211024, 0 3px 10px #1721100a",
            fontFamily: "Arial, Helvetica, sans-serif",
            zIndex: 1000,
          }}
        >
          <div style={{ padding: "10px 10px 16px", borderBottom: "1px solid #e8eadf", marginBottom: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", color: "#747e69", marginBottom: 6 }}>THE AJ COLLECTION</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 22 }}>Your personal spaces</div>
          </div>
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
                <span style={{ display: "grid", placeItems: "center", width: 64, height: 64 }}><AppIcon icon={app.icon} /></span>
                <span>{app.name}</span>
                <span style={{ fontSize: 10, color: "#747e69", fontWeight: 400 }}>{app.status === "unverified" ? "Deployment not verified" : app.status !== "available" ? app.status : currentApp === app.id ? "· Current app" : "Open space ↗"}</span>
              </>;
              const style = { display: "flex", flexDirection: "column" as const, alignItems: "center",
                justifyContent: "center", gap: 7, padding: "16px 8px", borderRadius: 14, minHeight: 142,
                color: "inherit", textDecoration: "none", fontSize: 13, fontWeight: 500, textAlign: "center" as const,
                background: currentApp === app.id ? "color-mix(in srgb, currentColor 6%, transparent)" : "transparent" };
              return app.status === "available" && app.url ? (
                <a className="aj-space" key={app.id} href={app.url} aria-label={`${app.name}${currentApp === app.id ? " · Current app" : ""}`} style={style} aria-current={currentApp === app.id ? "page" : undefined}>{content}</a>
              ) : <div key={app.id} style={style} aria-disabled="true">{content}</div>;
            })}
          </div>
          <a href="https://apps.ajoseph.dev/" style={{ display: "block", marginTop: 8, borderTop: "1px solid #e8eadf", padding: "14px 10px 4px", fontSize: 12, color: "#526747", textDecoration: "none" }}>All applications ↗</a>
        </div>
      )}
    </div>
  );
}
