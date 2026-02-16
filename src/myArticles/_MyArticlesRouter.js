import React, { useState, useContext, useEffect } from "react";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import SavedArticles from "./SavedArticles";
import HiddenArticles from "./HiddenArticles";
import { APIContext } from "../contexts/APIContext";

export default function MyArticlesRouter() {
  const api = useContext(APIContext);
  const [hiddenCount, setHiddenCount] = useState(0);

  useEffect(() => {
    // Get count of hidden articles
    api.getHiddenUserArticles(0, (articles) => {
      setHiddenCount(articles.length);
    });
  }, [api]);

  const tabsAndLinks = [
    {
      text: strings.saved,
      link: "/my-articles",
    },
    {
      text: strings.hidden,
      link: "/my-articles/hidden",
      counter: hiddenCount > 0 ? hiddenCount : null,
    },
  ];

  return (
    <s.NarrowColumn>
      <TopTabs title={strings.myArticles} tabsAndLinks={tabsAndLinks} />

      <PrivateRoute exact path="/my-articles" component={SavedArticles} />
      <PrivateRoute path="/my-articles/hidden" component={HiddenArticles} />
    </s.NarrowColumn>
  );
}
