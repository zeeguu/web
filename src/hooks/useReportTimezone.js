import { useContext, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import * as Sentry from "@sentry/react";
import { APIContext } from "../contexts/APIContext";
import LocalStorage from "../assorted/LocalStorage";

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

function reportIfChanged(api) {
  const tz = detectTimezone();
  if (!tz) return;
  if (localStorage.getItem(LocalStorage.Keys.ReportedTimezone) === tz) return;
  api.setUserTimezone(tz)
    .then(() => localStorage.setItem(LocalStorage.Keys.ReportedTimezone, tz))
    .catch((err) => {
      Sentry.captureException(err);
      console.warn("Failed to report timezone:", err);
    });
}

export default function useReportTimezone() {
  const api = useContext(APIContext);

  useEffect(() => {
    if (!api) return;

    reportIfChanged(api);

    // Native apps stay in memory across backgrounding, so a traveler who
    // lands and unlocks their phone won't trigger a fresh mount — listen for
    // resume to catch the tz change. Web gets a new mount on next page load.
    if (Capacitor.getPlatform() === "web") {
      return;
    }
    if (!Capacitor.isPluginAvailable("App")) {
      return;
    }

    let listenerHandle = null;
    (async () => {
      try {
        const { App } = await import("@capacitor/app");
        listenerHandle = await App.addListener("appStateChange", ({ isActive }) => {
          if (isActive) reportIfChanged(api);
        });
      } catch (err) {
        Sentry.captureException(err);
        console.warn("Failed to attach appStateChange listener:", err);
      }
    })();

    return () => {
      if (listenerHandle) listenerHandle.remove();
    };
  }, [api]);
}
