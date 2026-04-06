import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../contexts/APIContext";

export default function useFriendRequestNotification() {
  const path = useLocation().pathname;
  const api = useContext(APIContext);

  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const hasFriendRequestNotification = friendRequestCount > 0;

  useEffect(() => {
    updateFriendRequestCounter();
    // eslint-disable-next-line
  }, [path]);

  function updateFriendRequestCounter() {
    api.getNumberOfReceivedFriendRequests((count) => {
      setFriendRequestCount(count);
    });
  }

  return {
    friendRequestCount,
    hasFriendRequestNotification,
    updateFriendRequestCounter,
  };
}
