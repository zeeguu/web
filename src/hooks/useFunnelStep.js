import { useContext, useEffect } from "react";
import { APIContext } from "../contexts/APIContext";

/**
 * Record that an onboarding page was reached ("<step>_viewed"), and that the
 * visitor left the app while on it ("page_hidden"). The last event of a funnel
 * that ends in page_hidden is a drop-out on that page, and its time on the
 * page says whether they read it or bounced.
 *
 * A falsy step records nothing, for pages that are onboarding only for
 * visitors without an account.
 */
export default function useFunnelStep(step) {
  const api = useContext(APIContext);

  useEffect(() => {
    if (!step) return;
    api.funnelEvent(`${step}_viewed`);

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") api.funnelEvent("page_hidden", { on: step });
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [step]);
}
