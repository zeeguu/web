import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

export default function useBadgeCounterNotification() {
  const path = useLocation().pathname;
  const api = useContext(APIContext);

  const [hasBadgeNotification, setHasBadgeNotification] = useState(false);
  const [totalNumberOfBadges, setTotalNumberOfBadges] = useState(0);

  useEffect(() => {
    updateBadgeCounter();
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
