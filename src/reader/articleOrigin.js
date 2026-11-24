// Where the learner opened an article from (Evergreen, News, a search in
// News, Inbox, ...), sent as the value of OPEN ARTICLE so a study can tell
// reading started from one tab from reading started from another. Many
// screens link to the reader, so instead of each saying so, the app notes the
// last page that was not the reader (useLocationTracker); a list whose filter
// lives in its state, not its address (a search in News or Evergreen), adds it
// with noteArticleListFilter.

const ORIGIN_OF_PATH = {
  "/articles": "news",
  "/articles/evergreen": "evergreen",
  "/articles/shared": "inbox",
  "/articles/classroom": "classroom",
  "/articles/bookmarked": "saved",
  "/articles/history": "history",
  "/articles/ownTexts": "own_texts",
  "/shared-article": "share_sheet",
};

let lastPage = null;
let listFilter = null; // { page, filter }

export function isReaderPath(pathname) {
  return pathname === "/read" || pathname.startsWith("/read/");
}

const pageOf = (pathname) => pathname.replace(/(.)\/$/, "$1");

// Called on every navigation.
export function noteLocation(pathname) {
  if (pathname && !isReaderPath(pathname)) lastPage = pageOf(pathname);
}

// A list page saying which of its filters is on ("search", "keyword",
// "topic"), or null for none. Kept for the page it was noted on, so it does
// not follow the learner to another tab.
export function noteArticleListFilter(filter) {
  listFilter = filter ? { page: pageOf(window.location.pathname), filter } : null;
}

// "evergreen", "news:search", "inbox", "daily-audio", or "direct" for an
// article the app was opened on (a link, a reload).
export function originOf(page, filter) {
  if (!page) return "direct";
  const origin = ORIGIN_OF_PATH[page] || page.split("/")[1] || "direct";
  return filter ? `${origin}:${filter}` : origin;
}

export function articleOpenOrigin() {
  const filter = listFilter && listFilter.page === lastPage ? listFilter.filter : null;
  return originOf(lastPage, filter);
}
