// Payloads for the PREVIEW OPENED / PREVIEW CLOSED activity events.
//
// user_activity_data has no article_id column: the server only uses the
// article_id field to look up a source_id, and source_id is not unique across
// articles. So the article id travels in extra_data, next to the browsing
// session the preview belongs to.

// How a preview ended. "original" = tapped Read the original; "dismissed" =
// closed via X, backdrop or swipe without leaving.
export const PREVIEW_OUTCOME = {
  ORIGINAL: "original",
  DISMISSED: "dismissed",
};

export function previewOpenedExtraData({ articleId, browsingSessionId }) {
  return JSON.stringify({
    article_id: articleId,
    browsing_session_id: browsingSessionId ?? null,
  });
}

// Words as shown, so reading speed can be computed from the event alone: the
// summary a reader sees is per level and can be regenerated, so it cannot be
// reliably looked up again later.
export function countWords(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

export function previewClosedExtraData({ articleId, browsingSessionId, outcome, visibleMs, saved, title, summary }) {
  return JSON.stringify({
    article_id: articleId,
    browsing_session_id: browsingSessionId ?? null,
    outcome,
    visible_ms: Math.max(0, Math.round(visibleMs)),
    saved: !!saved,
    title_words: countWords(title),
    summary_words: countWords(summary),
  });
}

// Accumulates the time the preview was on screen with the page visible, so a
// preview left open while the app was backgrounded does not count as reading.
export function createVisibleTimer(now = () => Date.now(), initiallyVisible = true) {
  let total = 0;
  let since = initiallyVisible ? now() : null;
  return {
    pause() {
      if (since !== null) {
        total += now() - since;
        since = null;
      }
    },
    resume() {
      if (since === null) since = now();
    },
    elapsed() {
      return total + (since !== null ? now() - since : 0);
    },
  };
}
