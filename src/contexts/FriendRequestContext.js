import { createContext } from "react";

export const FriendRequestContext = createContext({
  friendRequestCount: 0,
  hasFriendRequestNotification: false,
  updateFriendRequestCounter: () => {},
});
