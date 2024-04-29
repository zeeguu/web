import { PrivateRoute } from "../PrivateRoute";
import Learned from "./Learned";
import Top from "./Top";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import WordsForArticle from "./WordsForArticle";
import Receptive from "./Receptive";
import Productive from "./Productive";
import Feature from "../features/Feature";

export default function WordsRouter({ api }) {
  let tabsAndLinks = {
    [strings.learned]: "/words/learned",
    "Top Words": "/words",
  };

  if (Feature.merle_exercises) {
    tabsAndLinks = {
      [strings.titleReceptiveWords]: "/words/receptive",
      [strings.titleProductiveWords]: "/words/productive",
      ...tabsAndLinks,
    };
  }

  return (
    <Switch>
      <PrivateRoute
        path="/words/forArticle/:articleID"
        api={api}
        component={WordsForArticle}
      />
      <PrivateRoute
        path="/render/words/forArticle/:articleID"
        api={api}
        component={WordsForArticle}
      />

      <s.NarrowColumn>
        <TopTabs
          title={strings.yourWordsHeadline}
          tabsAndLinks={tabsAndLinks}
        />

        <PrivateRoute path="/words/learned" api={api} component={Learned} />
        <PrivateRoute
          path="/render/words/learned"
          api={api}
          component={Learned}
        />

        <PrivateRoute exact path="/words" api={api} component={Top} />
        <PrivateRoute exact path="/render/words" api={api} component={Top} />
        <PrivateRoute
          exact
          path="/words/receptive"
          api={api}
          component={Receptive}
        />
        <PrivateRoute
          exact
          path="/render/words/receptive"
          api={api}
          component={Receptive}
        />
        <PrivateRoute
          exact
          path="/words/productive"
          api={api}
          component={Productive}
        />
        <PrivateRoute
          exact
          path="/render/words/productive"
          api={api}
          component={Productive}
        />
      </s.NarrowColumn>
    </Switch>
  );
}
