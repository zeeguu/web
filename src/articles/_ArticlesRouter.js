import FindArticles from "./FindArticles";
import BookmarkedArticles from "./BookmarkedArticles";
import { toast, ToastContainer } from "react-toastify";

import { PrivateRoute } from "../PrivateRoute";
import ClassroomArticles from "./ClassroomArticles";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";

import OwnArticles from "./OwnArticles";
import ReadingHistory from "../words/WordHistory";

import * as s from "../components/ColumnWidth.sc";
import LocalStorage from "../assorted/LocalStorage";

export default function ArticlesRouter({ api, hasExtension, isChrome }) {
  let tabsAndLinks = {
    [strings.homeTab]: "/articles",
    [strings.saved]: "/articles/ownTexts",
  };

  if (LocalStorage.isStudent()) {
    tabsAndLinks[strings.classroomTab] = "/articles/classroom";
  }

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
          path="/articles/history"
          api={api}
          component={ReadingHistory}
        />
        <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </s.NarrowColumn>
    </>
  );
}
