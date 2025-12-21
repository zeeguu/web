import ArticleListBrowser from "./ArticleListBrowser";
import BookmarkedArticles from "./BookmarkedArticles";

import { PrivateRoute } from "../PrivateRoute";
import ClassroomArticles from "./ClassroomArticles";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";

import OwnArticles from "./OwnArticles";
import ReadingHistory from "../words/WordHistory";
import MySearches from "./MySearches";
import Search from "./Search";

import * as s from "../components/ColumnWidth.sc";
import LocalStorage from "../assorted/LocalStorage";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import useBrowsingSession from "../hooks/useBrowsingSession";
import CustomizeGear from "./CustomizeGear";

export default function ArticlesRouter({ hasExtension, isChrome }) {
  const { getBrowsingSessionId } = useBrowsingSession();

  const tabsAndLinks = [
    { text: strings.homeTab, link: "/articles", action: <CustomizeGear /> },
    { text: strings.search, link: "/articles/mySearches" },
    { text: strings.saved, link: "/articles/ownTexts" },
    LocalStorage.isStudent() && { text: strings.classroomTab, link: "/articles/classroom" },
  ].filter(Boolean);

  return (
    <BrowsingSessionContext.Provider value={getBrowsingSessionId}>
      {/* Rendering top menu first, then routing to corresponding page */}
      <s.NarrowColumn>
        <TopTabs title={strings.articles} tabsAndLinks={tabsAndLinks} />

        <PrivateRoute
          path="/articles"
          exact
          component={ArticleListBrowser}
          hasExtension={hasExtension}
          isChrome={isChrome}
        />
        <PrivateRoute
          path="/articles/bookmarked"
          component={BookmarkedArticles}
        />
        <PrivateRoute
          path="/articles/classroom"
          component={ClassroomArticles}
        />

        <PrivateRoute path="/articles/ownTexts" component={OwnArticles} />

        <PrivateRoute path="/articles/history" component={ReadingHistory} />

        <PrivateRoute path="/articles/mySearches" component={MySearches} />

        <PrivateRoute path="/search" component={Search} />
      </s.NarrowColumn>
    </BrowsingSessionContext.Provider>
  );
}

// Having components passed to the Search
// look for a search, boolean
// passing a different prop, to make search
// render either search or no search
