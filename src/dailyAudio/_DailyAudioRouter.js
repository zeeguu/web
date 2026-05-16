import React, { useState, useContext, useEffect } from "react";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch, useLocation, useHistory } from "react-router-dom";
import TodayAudio from "./TodayAudio";
import PastLessons from "./PastLessons";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useTabSwipe from "../hooks/useTabSwipe";

const TAB_PATHS = ["/daily-audio", "/daily-audio/past-lessons"];

export default function DailyAudioRouter() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const learnedLanguage = userDetails?.learned_language;
  const location = useLocation();
  const history = useHistory();
  const [pastLessonsCount, setPastLessonsCount] = useState(0);
  const [showTabs, setShowTabs] = useState(true);

  const currentTabIndex = TAB_PATHS.indexOf(location.pathname);
  const canSwipe = (direction) => {
    const next = currentTabIndex + direction;
    return currentTabIndex !== -1 && next >= 0 && next < TAB_PATHS.length;
  };
  const onSwipe = (direction) => {
    if (canSwipe(direction)) history.push(TAB_PATHS[currentTabIndex + direction]);
  };
  const swipeRef = useTabSwipe(onSwipe, canSwipe);

  useEffect(() => {
    // Reset immediately so the tab badge doesn't show a stale count from
    // the previous language while the new request is in flight.
    setPastLessonsCount(0);
    api.getPastDailyLessons(
      1, // limit
      0, // offset
      (data) => {
        if (data.pagination && data.pagination.total !== undefined) {
          setPastLessonsCount(data.pagination.total);
        }
      },
      (error) => {
        console.error("Error getting past lessons count:", error);
      },
    );
  }, [api, learnedLanguage]);

  // Always show tabs on past-lessons page
  useEffect(() => {
    if (location.pathname === "/daily-audio/past-lessons") {
      setShowTabs(true);
    }
  }, [location.pathname]);

  let tabsAndLinks = [
    {
      text: strings.today,
      link: "/daily-audio"
    },
    {
      text: strings.pastLessons,
      link: "/daily-audio/past-lessons",
      counter: pastLessonsCount
    }
  ];

  return (
    <Switch>
      <s.NarrowColumn>
        {showTabs && <TopTabs title={strings.dailyAudio} tabsAndLinks={tabsAndLinks} />}

        <div ref={swipeRef}>
          <PrivateRoute exact path="/daily-audio" component={TodayAudio} setShowTabs={setShowTabs} />
          <PrivateRoute exact path="/daily-audio/past-lessons" component={PastLessons} />
        </div>
      </s.NarrowColumn>
    </Switch>
  );
}
