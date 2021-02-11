import { TopTab, SeparatorBar } from "../components/TopTab";
import { PrivateRoute } from "../PrivateRoute";
import WordHistory from "./WordHistory";
import Starred from "./Starred";
import Learned from "./Learned";
import Top from "./Top";
import * as s from "./Words.sc";
// import './newStyleWords.css'

export default function Words({ api }) {
  return (
    <s.Words>
      <s.TopTabs>
        <h1>Your Words</h1>

        <div className="all__tabs">
          <TopTab text="Translated" link="/words/history" />

          <SeparatorBar />

          <TopTab text="Starred" link="/words/starred" />

          <SeparatorBar />

          <TopTab text="Learned" link="/words/learned" />

          <SeparatorBar />

          <TopTab text="Top" link="/words/top" />
        </div>
      </s.TopTabs>

      <PrivateRoute
        path="/words/history"
        exact
        zapi={api}
        component={WordHistory}
      />

      <PrivateRoute path="/words/starred" zapi={api} component={Starred} />

      <PrivateRoute path="/words/learned" zapi={api} component={Learned} />

      <PrivateRoute path="/words/top" zapi={api} component={Top} />
    </s.Words>
  );
}
