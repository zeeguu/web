import { Capacitor } from "@capacitor/core";

// Calls `callback` when the native app comes back to the foreground, and
// returns a function that stops listening. Capacitor doesn't fire
// visibilitychange reliably on resume, so pair this with that listener.
// A no-op on the web.
export default function onAppResume(callback) {
  if (Capacitor.getPlatform() === "web" || !Capacitor.isPluginAvailable("App")) return () => {};

  let handle = null;
  let cancelled = false;
  (async () => {
    try {
      const { App } = await import("@capacitor/app");
      const h = await App.addListener("appStateChange", ({ isActive }) => {
        if (isActive) callback();
      });
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
