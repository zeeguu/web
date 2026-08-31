import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import useShadowRef from "./useShadowRef";

// Calls `onTick` on an interval, and immediately whenever the app comes back
// to the foreground.
//
// Two cadences, because the two situations are not the same. `intervalMs` runs
// while the app is visible — the only time a change on screen can actually be
// seen. While it's hidden, ticks are spaced out to `hiddenIntervalMs` (or
// stopped entirely, if that's null): nobody is looking, browsers throttle
// timers in hidden tabs anyway, and native apps freeze them outright.
//
// The resume callbacks are what make a return to the app feel instant — a
// frozen timer can otherwise be minutes late in firing.
export default function useForegroundPoll(onTick, { intervalMs, hiddenIntervalMs = null }) {
  const onTickRef = useShadowRef(onTick);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      lastTickRef.current = Date.now();
      if (onTickRef.current) onTickRef.current();
    };

    const intervalId = setInterval(() => {
      if (!document.hidden) {
        tick();
        return;
      }
      if (hiddenIntervalMs === null) return;
      if (Date.now() - lastTickRef.current >= hiddenIntervalMs) tick();
    }, intervalMs);

    const onVisibilityChange = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Capacitor doesn't fire visibilitychange reliably on resume — also listen
    // for the native lifecycle event so returning to the app refreshes at once.
    let appStateHandle = null;
    let cancelled = false;
    if (Capacitor.getPlatform() !== "web" && Capacitor.isPluginAvailable("App")) {
      (async () => {
        try {
          const { App } = await import("@capacitor/app");
          const handle = await App.addListener("appStateChange", ({ isActive }) => {
            if (isActive) tick();
          });
          if (cancelled) handle.remove();
          else appStateHandle = handle;
        } catch {
          // Best-effort — the interval still drives the poll
        }
      })();
    }

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (appStateHandle) appStateHandle.remove();
    };
    // eslint-disable-next-line
  }, [intervalMs, hiddenIntervalMs]);
}
