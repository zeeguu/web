import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import Feature from "../features/Feature";

// Drives the "Shared with you" inbox + its unread badge. Mirrors
// useFriendRequestNotification: refetches on navigation, gated on gamification.
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
    if (!Feature.has_gamification()) {
      setLoaded(true);
      return;
    }
    refreshSharedArticles();
    // eslint-disable-next-line
  }, [path]);

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
