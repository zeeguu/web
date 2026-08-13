import { createContext } from "react";

export const SharedArticlesContext = createContext({
  sharedArticles: [],
  sharedUnreadCount: 0,
  hasSharedNotification: false,
  sharedArticlesLoading: true,
  hasSharesInOtherLanguages: false,
  refreshSharedArticles: () => {},
});
