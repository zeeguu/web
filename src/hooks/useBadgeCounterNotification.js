import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";

export default function useBadgeCounterNotification() {
  const api = useContext(APIContext);

  const [hasBadgeNotification, setHasBadgeNotification] = useState(false);
  const [totalNumberOfBadges, setTotalNumberOfBadges] = useState(0);

  useEffect(() => {
    updateBadgeCounter();
  }, []);

  function updateBadgeCounter() {
    api.getNotShownUserBadges((badgeCount) => {
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
