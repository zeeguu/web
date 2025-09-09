import ArticleListBrowser from "./ArticleListBrowser";
import BookmarkedArticles from "./BookmarkedArticles";
import { useContext, useEffect, useState } from "react";

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
import { APIContext } from "../contexts/APIContext";

export default function ArticlesRouter({ hasExtension, isChrome }) {
  const api = useContext(APIContext);
  const [tabsAndLinks, setTabsAndLinks] = useState({
    [strings.homeTab]: "/articles",
    [strings.search]: "/articles/mySearches",
    [strings.saved]: "/articles/ownTexts",
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
  }, [api]);

  return (
    <>
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
        <PrivateRoute path="/articles/bookmarked" component={BookmarkedArticles} />

        <PrivateRoute path="/articles/classroom" component={ClassroomArticles} />

        <PrivateRoute path="/articles/ownTexts" component={OwnArticles} />

        <PrivateRoute path="/articles/forYou" component={RecommendedArticles} />

        <PrivateRoute path="/articles/history" component={ReadingHistory} />

        <PrivateRoute path="/articles/mySearches" component={MySearches} />

        <PrivateRoute path="/search" component={Search} />
      </s.NarrowColumn>
    </>
  );
}

// Having components passed to the Search
// look for a search, boolean
// passing a different prop, to make search
// render either search or no search
