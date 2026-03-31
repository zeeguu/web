import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

/**
 * Handles deep links when the app is already running.
 * When a user clicks a zeeguu.org link (e.g., from WhatsApp) and the app
 * is already open, this hook navigates to the correct route.
 */
export default function useDeepLinkHandler() {
  const history = useHistory();

  useEffect(() => {
    // Only set up listener on native platforms (iOS/Android)
    if (Capacitor.getPlatform() === "web") {
      return;
    }

    // Check if the App plugin is available
    if (!Capacitor.isPluginAvailable("App")) {
      console.warn("App plugin not available");
      return;
    }

    let listenerHandle = null;

    const handleAppUrlOpen = (event) => {
      try {
        // Deep links to zeeguu.org, e.g. "https://zeeguu.org/read/article?id=123"
        const parsedUrl = new URL(event.url);
        const fullPath = parsedUrl.pathname + parsedUrl.search;
        const separator = fullPath.includes("?") ? "&" : "?";
        history.push(fullPath + separator + "source=deeplink");
      } catch (error) {
        console.error("Failed to parse deep link URL:", error);
      }
    };

    // Import dynamically only when we know we're on native and plugin is available
    const setupListener = async () => {
      try {
        const { App } = await import("@capacitor/app");
        const handle = await App.addListener("appUrlOpen", handleAppUrlOpen);
        listenerHandle = handle;
      } catch (error) {
        console.error("Failed to setup deep link listener:", error);
      }
    };

    setupListener();

    // Cleanup listener on unmount
    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [history]);
}
