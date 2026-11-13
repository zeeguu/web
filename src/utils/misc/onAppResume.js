import { Capacitor } from "@capacitor/core";

// Calls `callback` when the native app comes back to the foreground, and
// returns a function that stops listening. Capacitor doesn't fire
// visibilitychange reliably on resume, so pair this with that listener.
// A no-op on the web.
export default function onAppResume(callback) {
  return onAppStateChange((isActive) => isActive && callback());
}

// The same when the native app goes to the background (it may be killed
// there): the moment to save what is still waiting to be saved.
export function onAppPause(callback) {
  return onAppStateChange((isActive) => !isActive && callback());
}

function onAppStateChange(handler) {
  if (Capacitor.getPlatform() === "web" || !Capacitor.isPluginAvailable("App")) return () => {};

  let handle = null;
  let cancelled = false;
  (async () => {
    try {
      const { App } = await import("@capacitor/app");
      const h = await App.addListener("appStateChange", ({ isActive }) => handler(isActive));
      if (cancelled) h.remove();
      else handle = h;
    } catch {
      // Best-effort — visibilitychange still covers most resumes
    }
  })();

  return () => {
    cancelled = true;
    if (handle) handle.remove();
  };
}
