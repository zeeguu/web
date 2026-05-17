import ArticleListBrowser from "./ArticleListBrowser";
import BookmarkedArticles from "./BookmarkedArticles";

import { Redirect } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import ClassroomArticles from "./ClassroomArticles";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";

import OwnArticles from "./OwnArticles";
import ReadingHistory from "../words/WordHistory";
import MySearches from "./MySearches";
import Search from "./Search";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import * as s from "../components/ColumnWidth.sc";
import LocalStorage from "../assorted/LocalStorage";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import useBrowsingSession from "../hooks/useBrowsingSession";
import useTabbedRoute from "../hooks/useTabbedRoute";

export default function ArticlesRouter({ hasExtension, isChrome }) {
  const { getBrowsingSessionId } = useBrowsingSession();
  const hideRecommendations = LocalStorage.hasFeature("hide_recommendations");
  const isStudent = LocalStorage.isStudent();

  const searchIcon = (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0 0.6em" }}>
      <SearchRoundedIcon style={{ fontSize: "1.25rem" }} />
    </span>
  );

  const tabs = [
    !hideRecommendations && { text: "Discover", link: "/articles" },
    !hideRecommendations && { text: searchIcon, link: "/articles/mySearches" },
    { text: strings.myArticles, link: "/articles/bookmarked" },
    isStudent && { text: strings.classroomTab, link: "/articles/classroom" },
  ].filter(Boolean);

  const swipeRef = useTabbedRoute(
    tabs.map((t) => t.link),
    { pathAliases: { "/search": "/articles/mySearches" } },
  );

  return (
    <BrowsingSessionContext.Provider value={getBrowsingSessionId}>
      {/* Rendering top menu first, then routing to corresponding page */}
      <s.NarrowColumn>
        <TopTabs title={strings.articles} tabsAndLinks={tabs} />

        <div ref={swipeRef} style={{ minHeight: "70vh" }}>
          {hideRecommendations ? (
            <Redirect from="/articles" exact to="/articles/classroom" />
          ) : (
            <PrivateRoute
              path="/articles"
              exact
              component={ArticleListBrowser}
              hasExtension={hasExtension}
              isChrome={isChrome}
            />
          )}
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
        </div>
      </s.NarrowColumn>
    </BrowsingSessionContext.Provider>
  );
}

// Having components passed to the Search
// look for a search, boolean
// passing a different prop, to make search
// render either search or no search
