import { createContext } from "react";

export const FriendRequestContext = createContext({
  hasFriendRequestNotification: false,
  friendRequestCount: 0,
  updateFriendRequestCounter: () => {},
});
