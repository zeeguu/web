import React, { useEffect } from "react";
import { Switch, useLocation } from "react-router-dom";
import LocalStorage from "../assorted/LocalStorage";
import { PrivateRoute } from "../PrivateRoute";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import Translate from "./Translate";
import TranslateHistory from "./TranslateHistory";
import useTabbedRoute from "../hooks/useTabbedRoute";
import { ContentContainer } from "../articles/_ArticlesRouter.sc";


const TRANSLATE_TAB_PATHS = ["/translate", "/translate/history"];

export default function TranslateRouter() {
  const location = useLocation();
  // Swipe left/right between the tabs, as in Read and Listen. Tuned like Read:
  // the history and the texts are vertical lists.
  const swipeRef = useTabbedRoute(TRANSLATE_TAB_PATHS, {
    swipeOptions: { threshold: 90, deadzone: 12, lockRatio: 1.6, qualifyRatio: 2 },
  });

  // Remember the tab, so the Translate button opens it again (as Read does).
  useEffect(() => {
    if (TRANSLATE_TAB_PATHS.includes(location.pathname)) {
      LocalStorage.setLastVisitedTranslatePath(location.pathname);
    }
  }, [location.pathname]);

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
      <PaddedNarrowColumn>
        <TopTabs tabsAndLinks={tabsAndLinks} />

        {/* As tall as Read's, so the swipe works on the empty space under
            the button too, not only on the field */}
        <ContentContainer ref={swipeRef}>
          <PrivateRoute exact path="/translate" component={Translate} />
          <PrivateRoute exact path="/translate/history" component={TranslateHistory} />
        </ContentContainer>
      </PaddedNarrowColumn>
    </Switch>
  );
}
