import React, { useState, useContext, useEffect } from "react";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import TodayAudio from "./TodayAudio";
import PastLessons from "./PastLessons";
import { APIContext } from "../contexts/APIContext";

export default function DailyAudioRouter() {
  const api = useContext(APIContext);
  const [pastLessonsCount, setPastLessonsCount] = useState(0);

  useEffect(() => {
    console.log("Get the count of past lessons");
    api.getPastDailyLessons(
      1, // limit
      0, // offset
      (data) => {
        console.log(data.pagination);
        if (data.pagination && data.pagination.total !== undefined) {
          setPastLessonsCount(data.pagination.total);
        }
      },
      (error) => {
        console.error("Error getting past lessons count:", error);
      },
    );
  }, [api]);

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
        <TopTabs title={strings.dailyAudio} tabsAndLinks={tabsAndLinks} />

        <PrivateRoute exact path="/daily-audio" component={TodayAudio} />
        <PrivateRoute exact path="/daily-audio/past-lessons" component={PastLessons} />
      </s.NarrowColumn>
    </Switch>
  );
}
