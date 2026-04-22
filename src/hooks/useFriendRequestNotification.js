import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";

export default function useFriendRequestNotification() {
  const api = useContext(APIContext);

  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const hasFriendRequestNotification = friendRequestCount > 0;

  useEffect(() => {
    updateFriendRequestCounter();
  }, []);

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
