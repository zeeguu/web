import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../contexts/APIContext";

export default function useBadgeCounterNotification() {
  const path = useLocation().pathname;
  const api = useContext(APIContext);

  const [hasBadgeNotification, setHasBadgeNotification] = useState(false);
  const [totalNumberOfBadges, setTotalNumberOfBadges] = useState(0);

  useEffect(() => {
    updateBadgeCounter();

    // eslint-disable-next-line
  }, [path]);

  function updateBadgeCounter() {
    api.getNotShownUserBadges((badgeCount) => {
      setTotalNumberOfBadges(badgeCount);

      setHasBadgeNotification(badgeCount >= 1);
    });
  }

  function decrementBadgeCounter() {
    setTotalNumberOfBadges((c) => Math.max(c - 1, 0));
    setHasBadgeNotification(true);
  }

  function incrementBadgeCounter() {
    setTotalNumberOfBadges(totalNumberOfBadges + 1);
    setHasBadgeNotification(true);
  }

  function hideBadgeCounter() {
    setHasBadgeNotification(false);
  }

  return {
    hasBadgeNotification,
    totalNumberOfBadges,
    updateBadgeCounter,
    decrementBadgeCounter,
    incrementBadgeCounter,
    hideBadgeCounter,
  };
}
