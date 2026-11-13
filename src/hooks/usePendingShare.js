import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

import { PENDING_SHARE_KEY, SHARE_WAITING_EVENT, parsePendingShare, destinationOf } from "../texts/pendingShare";
import { deliverSharedText } from "../texts/sharedText";

// Takes a share another app sent to the native app (see texts/pendingShare.js)
// and opens it: an article in the share flow, a short text in /texts. Only
// once logged in, so a share made before signing in waits for it.
export default function usePendingShare(loggedIn) {
  const history = useHistory();

  useEffect(() => {
    if (!loggedIn || Capacitor.getPlatform() === "web") return;

    let taking = false;
    async function takePendingShare() {
      if (taking) return; // startup, nudge and resume can arrive together
      taking = true;
      try {
        const { value } = await Preferences.get({ key: PENDING_SHARE_KEY });
        if (!value) return;
        await Preferences.remove({ key: PENDING_SHARE_KEY });
        const destination = destinationOf(parsePendingShare(value));
        if (destination?.path) history.push(destination.path);
        if (destination?.text) {
          deliverSharedText(destination.text);
          if (window.location.pathname !== "/texts") history.push("/texts");
        }
      } catch (e) {
        console.error("Could not take the pending share:", e);
      } finally {
        taking = false;
      }
    }

    takePendingShare();
    window.addEventListener(SHARE_WAITING_EVENT, takePendingShare);

    let resumeListener = null;
    import("@capacitor/app")
      .then(({ App }) => App.addListener("resume", takePendingShare))
      .then((handle) => (resumeListener = handle))
      .catch(() => {});

    return () => {
      window.removeEventListener(SHARE_WAITING_EVENT, takePendingShare);
      resumeListener?.remove();
    };
  }, [loggedIn, history]);
}
