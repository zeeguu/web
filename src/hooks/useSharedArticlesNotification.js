import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../contexts/APIContext";
import Feature from "../features/Feature";

// Drives the "Shared with you" inbox + its unread badge. Mirrors
// useFriendRequestNotification: refetches on navigation, gated on gamification.
export default function useSharedArticlesNotification() {
  const path = useLocation().pathname;
  const api = useContext(APIContext);

  const [sharedArticles, setSharedArticles] = useState([]);
  const sharedUnreadCount = sharedArticles.filter((s) => !s.read).length;
  const hasSharedNotification = sharedUnreadCount > 0;

  useEffect(() => {
    if (!Feature.has_gamification()) return;
    refreshSharedArticles();
    // eslint-disable-next-line
  }, [path]);

  function refreshSharedArticles() {
    api.getArticlesSharedWithMe((data) => {
      setSharedArticles(data || []);
    });
  }

  return {
    sharedArticles,
    sharedUnreadCount,
    hasSharedNotification,
    refreshSharedArticles,
  };
}
