import { validateRegistry } from "@ajoseph/app-launcher/registry";
import { AppIcon, AppLauncher } from "@ajoseph/app-launcher";
import { InstallApp } from "./install-app";

export const dynamic = "force-dynamic";

export default function Page() {
  const local = process.env.NODE_ENV === "development" && process.env.AJ_LOCAL_DEVELOPMENT === "true";
  const registry = validateRegistry(JSON.parse(process.env.AJ_APPS_CONFIG || "null"), { allowLocalhost: local });
  const apps = registry.apps.filter((app) => app.enabled && app.status !== "retired");
  return (
    <main>
      <header className="site-header"><a className="brand" href="/">aj.</a><div className="header-actions"><InstallApp /><AppLauncher currentApp="launcher" registryUrl="/apps.json" allowLocalhost={local} /></div></header>
      <section aria-labelledby="directory-title"><h1 id="directory-title">Applications</h1><div className="cards">
        {apps.map((app) => {
          const content = <><AppIcon icon={app.icon} /><span>{app.name}</span></>;
          return app.status === "available" && app.url ? <a className="app-card" href={app.url} key={app.id}>{content}<span className="arrow" aria-hidden="true">↗</span></a> : <div className="app-card" aria-disabled="true" key={app.id}>{content}<span className="status">{app.status === "unverified" ? "Unavailable" : app.status}</span></div>;
        })}
      </div>{apps.length === 0 && <p>No applications listed.</p>}</section>
    </main>
  );
}
