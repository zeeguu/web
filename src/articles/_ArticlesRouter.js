import FindArticles from "./FindArticles";
import BookmarkedArticles from "./BookmarkedArticles";
import { useEffect, useState } from "react";

import { PrivateRoute } from "../PrivateRoute";
import ClassroomArticles from "./ClassroomArticles";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";

import OwnArticles from "./OwnArticles";
import ReadingHistory from "../words/WordHistory";
import RecommendedArticles from "./RecommendedArticles";
import MySearches from "./MySearches";
import Search from "./Search";

import * as s from "../components/ColumnWidth.sc";
import LocalStorage from "../assorted/LocalStorage";

export default function ArticlesRouter({ api, hasExtension, isChrome }) {
  const [tabsAndLinks, setTabsAndLinks] = useState({
    [strings.homeTab]: "/articles",
    [strings.saved]: "/articles/ownTexts",
    [strings.searches]: "/articles/mySearches",
  });

  useEffect(() => {
    if (LocalStorage.isStudent()) {
      setTabsAndLinks((prevTabsAndLinks) => ({
        ...prevTabsAndLinks,
        [strings.classroomTab]: "/articles/classroom",
      }));
    }
  }, []);

  useEffect(() => {
    api.getBookmarkedArticles((articles) => {
      const likedArticles = articles.filter((article) => article.liked);
      if (likedArticles.length >= 5) {
        setTabsAndLinks((prevTabsAndLinks) => ({
          ...prevTabsAndLinks,
          [strings.forYou]: "/articles/forYou",
        }));
      }
    });
  }, []);

  return (
    <>
      {/* Rendering top menu first, then routing to corresponding page */}
      <s.NarrowColumn>
        <TopTabs title={strings.articles} tabsAndLinks={tabsAndLinks} />

        <PrivateRoute
          path="/articles"
          exact
          api={api}
          component={FindArticles}
          hasExtension={hasExtension}
          isChrome={isChrome}
        />

        <PrivateRoute
          path="/articles/bookmarked"
          api={api}
          component={BookmarkedArticles}
        />
        <PrivateRoute
          path="/articles/classroom"
          api={api}
          component={ClassroomArticles}
        />

        <PrivateRoute
          path="/articles/ownTexts"
          api={api}
          component={OwnArticles}
        />

        <PrivateRoute
          path="/articles/forYou"
          api={api}
          component={RecommendedArticles}
        />

        <PrivateRoute
          path="/articles/history"
          api={api}
          component={ReadingHistory}
        />

        <PrivateRoute
          path="/articles/mySearches"
          api={api}
          component={MySearches}
        />

        <PrivateRoute path="/search" api={api} component={Search} />
      </s.NarrowColumn>
    </>
  );
}

// Having components passed to the Search
// look for a search, boolean
// passing a different prop, to make search
// render either search or no search
