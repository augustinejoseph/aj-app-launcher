"use client";

import { useEffect, useId, useRef, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallApp() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId();

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () => setInstalled(standalone.matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true);
    const beforeInstall = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setPrompt(null); dialog.current?.close(); };
    updateInstalled();
    standalone.addEventListener("change", updateInstalled);
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      standalone.removeEventListener("change", updateInstalled);
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function showInstructions() {
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!window.isSecureContext) {
      setInstructions("Open this app over HTTPS to install it. For local testing, use localhost on this device; an HTTP address on your local network does not support PWA installation.");
    } else if (ios) {
      setInstructions("In Safari, open the Share menu and choose Add to Home Screen, then tap Add. If you are using an in-app browser, open this page in Safari first.");
    } else if (/Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)) {
      setInstructions("In Safari on Mac, choose File → Add to Dock. If that option is unavailable, open this page in a current version of Chrome or Edge.");
    } else {
      setInstructions("Open your browser menu and look for Install AJ Applications, Install app, or Add to Home Screen. If it is missing, visit this page in a regular Chrome or Edge window, interact with the page, and try again. An existing installation or a recently dismissed prompt can affect availability.");
    }
    dialog.current?.showModal();
  }

  async function install() {
    if (!prompt) { showInstructions(); return; }
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      showInstructions();
    } finally {
      setPrompt(null);
      setBusy(false);
    }
  }

  if (installed) return null;
  return (
    <>
      <button className="install-app" type="button" disabled={busy} onClick={install}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5" /></svg>
        {busy ? "Installing…" : "Install app"}
      </button>
      <dialog ref={dialog} className="install-dialog" aria-labelledby={heading}>
        <h2 id={heading}>Install AJ Applications</h2>
        <p>{instructions}</p>
        <form method="dialog"><button className="install-app" autoFocus>Got it</button></form>
      </dialog>
    </>
  );
}
