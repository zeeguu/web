import React from "react";
import { Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import Translate from "./Translate";
import TranslateHistory from "./TranslateHistory";
import ShortTexts from "../texts/ShortTexts";

function ShortTextsTab() {
  return <ShortTexts inTab />;
}

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
    // Text snippets the learner shared with Zeeguu from another app (a
    // WhatsApp message), to translate word by word.
    {
      text: strings.yourTextsTab,
      link: "/translate/texts",
    },
  ];

  return (
    <Switch>
      <PaddedNarrowColumn>
        <TopTabs tabsAndLinks={tabsAndLinks} />

        <PrivateRoute exact path="/translate" component={Translate} />
        <PrivateRoute exact path="/translate/history" component={TranslateHistory} />
        <PrivateRoute exact path="/translate/texts" component={ShortTextsTab} />
      </PaddedNarrowColumn>
    </Switch>
  );
}
