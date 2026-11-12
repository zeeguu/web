// What to do with text another app shared into Zeeguu (the phone's share
// sheet, or the installed web app's share target).
//
// A shared link, maybe with a title around it, is an article to open. Any
// other text — a chat message, even one that contains a link, a paragraph
// from a mail — is kept and read word by word (/texts). The native share handlers (MainActivity.java,
// ShareViewController.swift) apply the same rule; keep them in step.

// More words than this besides the link, and it's a message, not a title.
export const MAX_WORDS_AROUND_ARTICLE_LINK = 12;

// Same cap as the API's MAX_SHARED_TEXT_CHARS.
export const MAX_SHARED_TEXT_CHARS = 5000;

const URL_PATTERN = /https?:\/\/[^\s<>"]+/i;

export function classifySharedText(text, url = "") {
  const body = (text || "").trim();
  const link = (url || "").trim() || (body.match(URL_PATTERN) || [])[0] || "";

  if (!body && !link) return { kind: "nothing" };
  if (!body) return { kind: "article", url: link };
  if (!link) return { kind: "text", text: body };

  const wordsBesideLink = body
    .replace(link, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  if (wordsBesideLink <= MAX_WORDS_AROUND_ARTICLE_LINK) return { kind: "article", url: link };
  return { kind: "text", text: body };
}

// Native code hands the message over by calling window.reactReceiveSharedText
// (see index.js). It may arrive before the text page has mounted, or while
// it is already open, so it is kept here until the page takes it.
let pending = null;
let listener = null;

export function deliverSharedText(text) {
  if (listener) listener(text);
  else pending = text;
}

export function takePendingSharedText() {
  const text = pending;
  pending = null;
  return text;
}

export function onSharedText(fn) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}
