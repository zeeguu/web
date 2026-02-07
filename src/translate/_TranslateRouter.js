import React from "react";
import { Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import Translate from "./Translate";
import TranslateHistory from "./TranslateHistory";

export default function TranslateRouter() {
  const tabsAndLinks = [
    {
      text: strings.translate,
      link: "/translate",
    },
    {
      text: strings.historyTab,
      link: "/translate/history",
    },
  ];

  return (
    <Switch>
      <s.NarrowColumn>
        <TopTabs tabsAndLinks={tabsAndLinks} />

        <PrivateRoute exact path="/translate" component={Translate} />
        <PrivateRoute exact path="/translate/history" component={TranslateHistory} />
      </s.NarrowColumn>
    </Switch>
  );
}
