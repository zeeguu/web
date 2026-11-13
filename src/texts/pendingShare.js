// What another app shared into the native app, waiting to be read.
//
// Android's MainActivity and iOS's AppDelegate store the share under
// PENDING_SHARE_KEY in Capacitor's own key-value storage, and nudge a page
// that is already running with a SHARE_WAITING_EVENT. The web app takes it
// whenever it is ready (usePendingShare): at startup, on the nudge, and on
// resume. Nothing is pushed into a page that may not have loaded yet, nothing
// is lost if the page reloads, and the text never goes into a URL.
//
// A share is { text } or { url }; whether it is an article or a short text is
// decided here, by classifySharedText, for both platforms.

import { classifySharedText } from "./sharedText";

export const PENDING_SHARE_KEY = "zeeguu.pendingShare";
export const SHARE_WAITING_EVENT = "zeeguu:share";

// The stored value, or null when it is missing or unreadable
export function parsePendingShare(value) {
  if (!value) return null;
  try {
    const share = JSON.parse(value);
    return share && typeof share === "object" ? share : null;
  } catch {
    return null;
  }
}

// Where a share goes: { path } for an article, { text } for a short text,
// or null for nothing usable
export function destinationOf(share) {
  if (!share) return null;
  const shared = classifySharedText(share.text, share.url);
  if (shared.kind === "article") return { path: "/shared-article?url=" + encodeURIComponent(shared.url) };
  if (shared.kind === "text") return { text: shared.text };
  return null;
}
