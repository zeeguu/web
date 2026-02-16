import React from "react";
import { Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import OwnArticles from "../articles/OwnArticles";
import HiddenArticles from "./HiddenArticles";

export default function MyArticlesRouter() {
  const tabsAndLinks = [
    {
      text: strings.saved,
      link: "/my-articles",
    },
    {
      text: strings.hidden,
      link: "/my-articles/hidden",
    },
  ];

  return (
    <s.NarrowColumn>
      <TopTabs title={strings.myArticles} tabsAndLinks={tabsAndLinks} />

      <Switch>
        <PrivateRoute exact path="/my-articles" component={OwnArticles} />
        <PrivateRoute path="/my-articles/hidden" component={HiddenArticles} />
      </Switch>
    </s.NarrowColumn>
  );
}
