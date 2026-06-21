import { useEffect, useState } from "react";

// Reactive browser connectivity: tracks navigator.onLine plus the online/offline
// events so consumers re-render when the device loses or regains a network. This
// is the "is there any connection at all" signal (hard offline), not server
// reachability — for that, see the probes in LoadingAnimation.
export default function useIsOffline() {
  const [offline, setOffline] = useState(typeof navigator !== "undefined" && navigator.onLine === false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return offline;
}
