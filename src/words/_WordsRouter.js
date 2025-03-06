import { PrivateRoute } from "../PrivateRoute";
import Learned from "./Learned";
import Top from "./Top";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import WordsForArticle from "./WordsForArticle";
import Feature from "../features/Feature";
import Learning from "./Learning";

export default function WordsRouter() {
  let tabsAndLinks = {
    [strings.learned]: "/words/learned",
    [strings.topWords]: "/words",
  };

  if (Feature.merle_exercises) {
    tabsAndLinks = {
      [strings.learning]: "/words",
      [strings.learned]: "/words/learned",
    };
  }

  return (
    <Switch>
      <PrivateRoute
        path="/words/forArticle/:articleID"
        component={WordsForArticle}
      />
      <PrivateRoute
        path="/render/words/forArticle/:articleID"
        component={WordsForArticle}
      />

      <s.NarrowColumn>
        <TopTabs
          title={strings.yourWordsHeadline}
          tabsAndLinks={tabsAndLinks}
        />

        <PrivateRoute path="/words/learned" component={Learned} />

        <PrivateRoute path="/render/words/learned" component={Learned} />

        {Feature.merle_exercises ? (
          <PrivateRoute exact path="/words" component={Learning} />
        ) : (
          <PrivateRoute exact path="/words" component={Top} />
        )}

        <PrivateRoute exact path="/render/words" component={Top} />

        <PrivateRoute exact path="/words/learning" component={Learning} />

        <PrivateRoute
          exact
          path="/render/words/learning"
          component={Learning}
        />

        <PrivateRoute exact path="/words/top" component={Top} />
      </s.NarrowColumn>
    </Switch>
  );
}
