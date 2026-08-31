import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useForegroundPoll from "./useForegroundPoll";

// The inbox badge only exists on the article tabs (see _ArticlesRouter), so
// those are the only routes where arriving-share-becomes-visible is a thing a
// user can witness. Poll every second there — a share landing while someone
// watches the screen should show up while they're still watching — and back
// off to a minute everywhere else, which is only about being up to date by the
// time they navigate back.
const BADGE_VISIBLE_INTERVAL_MS = 1000;
const ELSEWHERE_INTERVAL_MS = 60 * 1000;

function badgeIsOnScreen(path) {
  return path.startsWith("/articles") || path === "/search";
}

// Drives the "Shared with you" inbox + its unread badge. Refetches on
// navigation, and polls so a share arriving mid-session appears on its own.
export default function useSharedArticlesNotification() {
  const path = useLocation().pathname;
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const activeLanguage = userDetails?.learned_language;

  const [allShares, setAllShares] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // A share is a per-language item: the API stamps every share with a
  // delivery_language (the recipient's study language for it), so a Danish
  // share doesn't surface while you're studying German. Show only shares for
  // the language currently being studied; the badge counts the same filtered
  // set, so it never disagrees with the list. (Legacy rows created before
  // routing have no delivery_language and simply don't appear — re-share to
  // route them.)
  const sharedArticles = allShares.filter(
    (s) => s.delivery_language === activeLanguage,
  );
  const sharedUnreadCount = sharedArticles.filter((s) => !s.read).length;
  const hasSharedNotification = sharedUnreadCount > 0;

  // Shares exist, just not in the language currently being studied — lets the
  // empty state say "none in this language (others elsewhere)" rather than the
  // misleading "nothing shared with you yet".
  const hasSharesInOtherLanguages = allShares.some(
    (s) => s.delivery_language && s.delivery_language !== activeLanguage,
  );

  // Loading until the first fetch is back AND the active language is known, so
  // the inbox never flashes its "nothing shared yet" empty state before it can
  // actually filter.
  const sharedArticlesLoading = !loaded || activeLanguage === undefined;

  useEffect(() => {
    refreshSharedArticles();
    // eslint-disable-next-line
  }, [path]);

  // Each tick asks the cheap signature endpoint whether anything moved, and
  // only then pays for the real inbox. That's what makes a one-second cadence
  // affordable: a share arriving is rare, so nearly every tick is one aggregate
  // query and ~30 bytes back.
  //
  // A failed tick needs no handling: the next one is a second away, and the
  // signature it reads is absolute, not a delta, so nothing is lost by missing
  // one.
  const lastSignatureRef = useRef(null);

  function pollForInboxChanges() {
    api.getSharedArticlesInboxSignature((signature) => {
      if (signature === lastSignatureRef.current) return;
      lastSignatureRef.current = signature;
      // Picks up shares that arrive mid-session, and flips a row from "not
      // ready" to ready once its background-generated derivative lands.
      refreshSharedArticles();
    });
  }

  useForegroundPoll(pollForInboxChanges, {
    intervalMs: badgeIsOnScreen(path) ? BADGE_VISIBLE_INTERVAL_MS : ELSEWHERE_INTERVAL_MS,
    hiddenIntervalMs: ELSEWHERE_INTERVAL_MS,
  });

  function refreshSharedArticles() {
    api.getArticlesSharedWithMe((data) => {
      setAllShares(data || []);
      setLoaded(true);
    });
  }

  return {
    sharedArticles,
    sharedUnreadCount,
    hasSharedNotification,
    sharedArticlesLoading,
    hasSharesInOtherLanguages,
    refreshSharedArticles,
  };
}
