import React from "react";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "./_ActivityRouter.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import SessionHistory from "../words/SessionHistory";

export default function ActivityRouter() {
  const tabsAndLinks = [
    {
      text: strings.historyTab,
      link: "/activity-history",
    },
  ];

  return (
    <Switch>
      <s.ActivityNarrowColumn>
        <TopTabs title={strings.activity} tabsAndLinks={tabsAndLinks} />

        <PrivateRoute exact path="/activity-history" component={SessionHistory} />
      </s.ActivityNarrowColumn>
    </Switch>
  );
}
