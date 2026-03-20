import React from "react";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import SessionHistory from "../words/SessionHistory";
import UserDashboard from "../userDashboard/UserDashboard";

export default function ActivityRouter() {
  const tabsAndLinks = [
    {
      text: strings.historyTab,
      link: "/activity-history",
    },
    {
      text: strings.statisticsTab,
      link: "/activity-history/statistics",
    }
  ];

  return (
    <Switch>
      <s.NarrowColumn>
        <TopTabs title={strings.activity} tabsAndLinks={tabsAndLinks} />

        <PrivateRoute exact path="/activity-history" component={SessionHistory} />
        <PrivateRoute path="/activity-history/statistics" component={UserDashboard} />
      </s.NarrowColumn>
    </Switch>
  );
}
