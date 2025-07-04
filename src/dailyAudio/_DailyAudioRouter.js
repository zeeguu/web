import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";
import { Switch } from "react-router-dom";
import TodayAudio from "./TodayAudio";
import PastLessons from "./PastLessons";

export default function DailyAudioRouter() {
  let tabsAndLinks = {
    [strings.today]: "/daily-audio",
    [strings.pastLessons]: "/daily-audio/past-lessons",
  };

  return (
    <Switch>
      <s.NarrowColumn>
        <TopTabs
          title={strings.dailyAudio}
          tabsAndLinks={tabsAndLinks}
        />

        <PrivateRoute exact path="/daily-audio" component={TodayAudio} />
        <PrivateRoute exact path="/daily-audio/past-lessons" component={PastLessons} />
      </s.NarrowColumn>
    </Switch>
  );
}