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

  useEffect(() => {
    if (!Feature.has_gamification()) return;
    refreshSharedArticles();
    // eslint-disable-next-line
  }, [path]);

  function refreshSharedArticles() {
    api.getArticlesSharedWithMe((data) => {
      setAllShares(data || []);
    });
  }

  return {
    sharedArticles,
    sharedUnreadCount,
    hasSharedNotification,
    refreshSharedArticles,
  };
}
