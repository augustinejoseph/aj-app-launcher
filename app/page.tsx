import { validateRegistry } from "@ajoseph/app-launcher/registry";
import { AppIcon, AppLauncher } from "@ajoseph/app-launcher";
import { InstallApp } from "./install-app";

function AppArtwork({ health }: { health: boolean }) {
  return (
    <div className={`app-art ${health ? "health-art" : "journal-art"}`} aria-hidden="true">
      {health ? (
        <>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <svg className="pulse" viewBox="0 0 400 160" fill="none"><path d="M0 86h100l22-30 28 58 40-100 37 134 26-62h147" /></svg>
          <span className="art-note">A little stronger, every day.</span>
        </>
      ) : (
        <>
          <div className="paper paper-back" />
          <div className="paper paper-front"><span className="paper-date">A MOMENT TO YOURSELF</span><span className="paper-script">Make room<br />for your thoughts.</span><i /><i /><i /></div>
          <span className="art-note">Small moments. Lasting meaning.</span>
        </>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function Page() {
  const local = process.env.NODE_ENV === "development" && process.env.AJ_LOCAL_DEVELOPMENT === "true";
  const registry = validateRegistry(JSON.parse(process.env.AJ_APPS_CONFIG || "null"), { allowLocalhost: local });
  const apps = registry.apps.filter((app) => app.enabled && app.status !== "retired");
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="AJ applications home"><span className="brand-mark">aj<span>.</span></span><span className="brand-label">A PERSONAL COLLECTION</span></a>
        <div className="header-actions"><a className="directory-link" href="#applications">Your applications <span>↙</span></a><InstallApp /><AppLauncher currentApp="launcher" registryUrl="/apps.json" allowLocalhost={local} /></div>
      </header>
      <section className="intro">
        <div className="intro-copy"><p className="eyebrow"><span /> SPACE FOR WHAT MATTERS</p><h1>A little more intention.<br /><em>A space for you.</em></h1><p className="intro-description">Thoughtful tools for your everyday life.<br />Take care of yourself. Make room to reflect.</p></div>
        <div className="intro-aside"><span className="asterisk" aria-hidden="true">✳</span><p>Different parts of life.<br />One place to begin.</p><a href="#applications" aria-label="Explore your applications">↓</a></div>
      </section>
      <section id="applications" aria-labelledby="directory-title" className="directory">
        <div className="section-heading"><h2 id="directory-title">Your applications <span>{String(apps.length).padStart(2, "0")}</span></h2><span>BUILT AROUND YOU</span></div>
        <div className="cards">
          {apps.map((app, index) => {
            const available = app.status === "available" && !!app.url;
            return (
              <article className={`app-card ${app.icon === "heart-pulse" ? "health" : "journal"}`} key={app.id}>
                <AppArtwork health={app.icon === "heart-pulse"} />
                <div className="card-content"><div className="card-heading"><span className="app-icon"><AppIcon icon={app.icon} /></span><span className="app-category">{app.icon === "heart-pulse" ? "WELLBEING & ROUTINE" : "THOUGHTS & REFLECTION"}</span><span className="card-number">/{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{app.name}</h3><p className="app-description">{app.description}</p>
                <div className="card-bottom">{available ? <a className="open-app" href={app.url!}>Open application <span>↗</span></a> : <span className="status"><span />{app.status === "unverified" ? "Deployment not verified" : app.status}</span>}<span className="privacy"><svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true"><rect x="1.5" y="6" width="9" height="6.5" rx="1.5" stroke="currentColor" /><path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" /></svg>Private sign-in</span></div></div>
              </article>
            );
          })}
        </div>
        {apps.length === 0 && <p className="empty-state">Your next space is on its way. Applications will appear here when added.</p>}
      </section>
      <div className="collection-note"><span className="note-symbol" aria-hidden="true">↳</span><p>Separate spaces. A shared intention.<span>Each application has its own secure sign-in, so your personal spaces stay personal.</span></p></div>
      <footer><a href="/" className="footer-brand">ajoseph.dev</a><span>A few good tools. A little more space.</span><span className="footer-end">MADE FOR EVERYDAY LIFE <span>✳</span></span></footer>
    </main>
  );
}
