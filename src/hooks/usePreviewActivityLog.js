import { useCallback, useContext, useEffect, useRef } from "react";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import useShadowRef from "./useShadowRef";
import {
  PREVIEW_OUTCOME,
  createVisibleTimer,
  previewClosedExtraData,
  previewOpenedExtraData,
} from "../articles/previewActivityLog";

// Logs PREVIEW OPENED when the overlay mounts and PREVIEW CLOSED (with the
// visible time and how it ended) when it goes away. The overlay is mounted only
// while open, so mount/unmount is open/close.
//
// "Read the original" on mobile navigates the whole page away (_self), and the
// overlay never unmounts — so the close is also flushed on pagehide. A ref
// makes sure only one of the two paths reports it.
export default function usePreviewActivityLog(article, isArticleSaved) {
  const api = useContext(APIContext);
  const getBrowsingSessionId = useContext(BrowsingSessionContext);
  const outcomeRef = useRef(PREVIEW_OUTCOME.DISMISSED);
  const savedRef = useShadowRef(isArticleSaved);

  useEffect(() => {
    const articleId = article.id;
    const timer = createVisibleTimer(undefined, !document.hidden);
    let closed = false;

    // The tap that opens a preview can be the first interaction on the page,
    // which is what starts the browsing session -- and its id arrives
    // asynchronously. So OPENED may carry null; CLOSED reads it again.
    api.logUserActivity(
      api.PREVIEW_OPENED,
      articleId,
      "",
      previewOpenedExtraData({ articleId, browsingSessionId: getBrowsingSessionId?.() }),
    );

    function logClosed() {
      if (closed) return;
      closed = true;
      const visibleMs = timer.elapsed();
      api.logUserActivity(
        api.PREVIEW_CLOSED,
        articleId,
        // value = whole seconds, so it can be aggregated without parsing JSON
        String(Math.round(visibleMs / 1000)),
        previewClosedExtraData({
          articleId,
          browsingSessionId: getBrowsingSessionId?.(),
          outcome: outcomeRef.current,
          visibleMs,
          saved: savedRef.current,
          title: article.title,
          summary: article.summary,
        }),
      );
    }

    function handleVisibility() {
      if (document.hidden) timer.pause();
      else timer.resume();
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", logClosed);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", logClosed);
      logClosed();
    };
    // One open/close pair per mount; the article does not change under an open overlay.
    // eslint-disable-next-line
  }, []);

  const markOpenedOriginal = useCallback(() => {
    outcomeRef.current = PREVIEW_OUTCOME.ORIGINAL;
  }, []);

  return { markOpenedOriginal };
}
