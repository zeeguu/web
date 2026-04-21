import { createContext } from "react";

export const BadgeCounterContext = createContext({
  hasBadgeNotification: false,
  totalNumberOfBadges: 0,
});