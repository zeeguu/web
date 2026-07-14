import ArticleListBrowser from "../articles/ArticleListBrowser";
import { NarrowColumn } from "../components/ColumnWidth.sc";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import useBrowsingSession from "../hooks/useBrowsingSession";

// The kiosk feed reuses the normal recommended-article list, but in kioskMode
// the list hides its search field and topic filter bar and forces every
// article to open in the in-app reader (never the external publisher site).
export default function KioskFeed() {
  const { getBrowsingSessionId } = useBrowsingSession();

  return (
    <BrowsingSessionContext.Provider value={getBrowsingSessionId}>
      <NarrowColumn>
        <ArticleListBrowser kioskMode />
      </NarrowColumn>
    </BrowsingSessionContext.Provider>
  );
}
