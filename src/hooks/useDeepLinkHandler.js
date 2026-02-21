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
      // event.url is something like "https://zeeguu.org/read/article?id=123"
      const url = event.url;

      try {
        const parsedUrl = new URL(url);
        // Get the path and search params (e.g., "/read/article?id=123")
        const fullPath = parsedUrl.pathname + parsedUrl.search;

        console.log("Deep link received:", url);
        console.log("Navigating to:", fullPath);

        // Navigate to the path
        history.push(fullPath);
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
