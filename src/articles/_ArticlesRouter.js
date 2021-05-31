import FindArticles from "./FindArticles";
import BookmarkedArticles from "./BookmarkedArticles";

import { PrivateRoute } from "../PrivateRoute";
import Search from "./Search";
import ClassroomArticles from "./ClassroomArticles";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";

import OwnArticles from "./OwnArticles";

import * as s from "../components/ColumnWidth.sc";

export default function ArticlesRouter({ api }) {
  return (
    <>
      {/* Rendering top menu first, then routing to corresponding page */}
      <s.NarrowColumn>
        <TopTabs
          title={strings.articles}
          tabsAndLinks={{
            [strings.findTab]: "/articles",
            [strings.classroomTab]: "/articles/classroom",
            [strings.bookmarkedTab]: "/articles/bookmarked",
            [strings.ownTextsTab]: "articles/ownArticles",
          }}
        />

        <PrivateRoute
          path="/articles"
          exact
          api={api}
          component={FindArticles}
        />
        <PrivateRoute
          path="/articles/search/:term"
          api={api}
          component={Search}
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
      </s.NarrowColumn>
    </>
  );
}
