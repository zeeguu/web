import React, { createContext, useContext, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { API_ENDPOINT } from "../appConstants";

const PROBE_TIMEOUT_MS = 4000;
const POLL_INTERVAL_MS = 20000;

// Single app-wide "is offline" signal: the context value is a boolean that is
// `true` when the server can't be reached, `false` when it can. One provider
// does all the probing/listening so consumers (the top tabs, the daily-audio
// loader, the loading spinner's offline state) share one source instead of each
// running its own. Default `false` = assume online until a probe proves
// otherwise, so nothing flashes an offline state before the provider mounts.
const ConnectivityContext = createContext(false);

// Why probe instead of trusting navigator.onLine: that signal (and the
// online/offline events) is unreliable in the two environments that matter
// here — the iOS WKWebView leaves it stuck "online" in airplane mode, and
// Chrome DevTools "Offline" just blocks requests without flipping it. A real
// request to a zero-work endpoint is the only check that works everywhere.
async function serverReachable() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const res = await fetch(`${API_ENDPOINT}/ping`, { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export function ConnectivityProvider({ children }) {
  const [offline, setOffline] = useState(typeof navigator !== "undefined" && navigator.onLine === false);

  useEffect(() => {
    let cancelled = false;

    const recheck = async () => {
      // navigator.onLine === false is conclusive (no interface at all); only
      // its "true" is untrustworthy, so confirm that case with a real probe.
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        if (!cancelled) setOffline(true);
        return;
      }
      const reachable = await serverReachable();
      if (!cancelled) setOffline(!reachable);
    };

    recheck();
    const pollId = setInterval(recheck, POLL_INTERVAL_MS);
    window.addEventListener("online", recheck);
    window.addEventListener("offline", recheck);
    // Re-check when the user returns to the tab / app — connectivity often
    // changed while it was backgrounded and the events can be missed.
    const onVisible = () => {
      if (!document.hidden) recheck();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Native: the OS connectivity change fires reliably where the web events
    // don't, so use it to trigger an immediate re-check.
    let netHandle = null;
    if (Capacitor.getPlatform() !== "web" && Capacitor.isPluginAvailable("Network")) {
      (async () => {
        try {
          const { Network } = await import("@capacitor/network");
          netHandle = await Network.addListener("networkStatusChange", recheck);
        } catch {
          // The poll + web events still drive it
        }
      })();
    }

    return () => {
      cancelled = true;
      clearInterval(pollId);
      window.removeEventListener("online", recheck);
      window.removeEventListener("offline", recheck);
      document.removeEventListener("visibilitychange", onVisible);
      if (netHandle) netHandle.remove();
    };
  }, []);

  return <ConnectivityContext.Provider value={offline}>{children}</ConnectivityContext.Provider>;
}

// True when the server can't be reached. Reads the shared signal above.
export function useIsOffline() {
  return useContext(ConnectivityContext);
}
