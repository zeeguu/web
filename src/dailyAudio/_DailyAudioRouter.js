import React, { useState, useContext, useEffect } from "react";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import TodayAudio from "./TodayAudio";
import PastLessons from "./PastLessons";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useTabbedRoute from "../hooks/useTabbedRoute";

const TAB_PATHS = ["/daily-audio", "/daily-audio/past-lessons"];

export default function DailyAudioRouter() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const learnedLanguage = userDetails?.learned_language;
  const [pastLessonsCount, setPastLessonsCount] = useState(0);

  const swipeRef = useTabbedRoute(TAB_PATHS);

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

  // Self-pruning: with no past lessons there's nothing to switch between, so the
  // tab bar is just noise — render the current lesson on its own. The tabs
  // appear once a back catalogue exists. (/past-lessons stays a valid route.)
  const hasPastLessons = pastLessonsCount > 0;

  const tabsAndLinks = [
    { text: strings.currentLesson, link: "/daily-audio" },
    { text: strings.pastLessons, link: "/daily-audio/past-lessons", counter: pastLessonsCount },
  ];

  const routes = (
    <div ref={swipeRef}>
      <PrivateRoute exact path="/daily-audio" component={TodayAudio} />
      <PrivateRoute exact path="/daily-audio/past-lessons" component={PastLessons} />
    </div>
  );

  return (
    <Switch>
      <s.NarrowColumn>
        {hasPastLessons && <TopTabs title={strings.dailyAudio} tabsAndLinks={tabsAndLinks} />}
        {routes}
      </s.NarrowColumn>
    </Switch>
  );
}
