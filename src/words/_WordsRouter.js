import { PrivateRoute } from "../PrivateRoute";
import ReadingHistory from "./WordHistory";
import Starred from "./Starred";
import Learned from "./Learned";
import Top from "./Top";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import WordsForArticle from "./WordsForArticle";

export default function WordsRouter({ api }) {
  return (
    <Switch>
      <PrivateRoute
        path="/words/forArticle/:articleID"
        api={api}
        component={WordsForArticle}
      />

      <s.NarrowColumn>
        <TopTabs
          title={strings.yourWordsHeadline}
          tabsAndLinks={{
            [strings.translated]: "/words/translated",
            [strings.learned]: "/words/learned",
            // [strings.starred]: "/words/starred",
          }}
        />

        {/* <PrivateRoute path="/words/starred" api={api} component={Starred} /> */}

        <PrivateRoute path="/words/learned" api={api} component={Learned} />

        <PrivateRoute path="/words/translated" api={api} component={Top} />
      </s.NarrowColumn>
    </Switch>
  );
}
