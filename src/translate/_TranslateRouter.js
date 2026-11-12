import React from "react";
import { Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import Translate from "./Translate";
import TranslateHistory from "./TranslateHistory";
import MessageReader from "./MessageReader";

export default function TranslateRouter() {
  const tabsAndLinks = [
    {
      text: strings.translate,
      link: "/translate",
    },
    {
      text: strings.messageTab,
      link: "/translate/message",
    },
    {
      text: strings.historyTab,
      link: "/translate/history",
    },
  ];

  return (
    <Switch>
      <PaddedNarrowColumn>
        <TopTabs tabsAndLinks={tabsAndLinks} />

        <PrivateRoute exact path="/translate" component={Translate} />
        <PrivateRoute exact path="/translate/message" component={MessageReader} />
        <PrivateRoute exact path="/translate/history" component={TranslateHistory} />
      </PaddedNarrowColumn>
    </Switch>
  );
}
