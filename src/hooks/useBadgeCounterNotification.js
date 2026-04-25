import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import Feature from "../features/Feature";

export default function useBadgeCounterNotification() {
  const path = useLocation().pathname;
  const api = useContext(APIContext);

  const [hasBadgeNotification, setHasBadgeNotification] = useState(false);
  const [totalNumberOfBadges, setTotalNumberOfBadges] = useState(0);

  useEffect(() => {
    if (!Feature.has_gamification()) return;
    updateBadgeCounter();
    // eslint-disable-next-line
  }, [path]);

  function updateBadgeCounter() {
    api.getUnseenBadgeCount((badgeCount) => {
      setTotalNumberOfBadges(badgeCount);

      setHasBadgeNotification(badgeCount >= 1);
    });
  }

  return {
    hasBadgeNotification,
    totalNumberOfBadges,
    updateBadgeCounter,
  };
}
