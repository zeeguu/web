import { useContext, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { APIContext } from "../contexts/APIContext";

const STORAGE_KEY = "reported_timezone";

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
  if (localStorage.getItem(STORAGE_KEY) === tz) return;
  api.setUserTimezone(tz)
    .then(() => localStorage.setItem(STORAGE_KEY, tz))
    .catch((err) => console.warn("Failed to report timezone:", err));
}

export default function useReportTimezone() {
  const api = useContext(APIContext);

  useEffect(() => {
    if (!api) return;

    reportIfChanged(api);

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
        console.warn("Failed to attach appStateChange listener:", err);
      }
    })();

    return () => {
      if (listenerHandle) listenerHandle.remove();
    };
  }, [api]);
}
