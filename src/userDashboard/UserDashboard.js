import { useContext, useEffect } from "react";
import ProgressOverview from "./ProgressOverview";
import * as s from "./userDashboard_Styled/UserDashboard.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import { ProgressContext } from "../contexts/ProgressContext";
import {
  getWeeklyTranslatedWordsCount,
  calculateTotalReadingMinutes,
  calculateWeeklyReadingMinutes,
} from "../utils/progressTracking/progressHelpers";

export default function UserDashboard() {
  const api = useContext(APIContext);
  const {
    setWeeklyTranslated,
    setTotalReadingMinutes,
    setTotalTranslated,
    setTotalInLearning,
    setTotalLearned,
    setDaysPracticed,
    setWeeklyPracticed,
    setWeeklyReadingMinutes,
  } = useContext(ProgressContext);

  useEffect(() => {
    setTitle(strings.titleUserDashboard);
    api.logUserActivity(api.USER_DASHBOARD_OPEN);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    api.getBookmarksCountsByDate((counts) => {
      const totalTranslatedWords = counts.reduce(
        (sum, day) => sum + day.count,
        0
      );
      setTotalTranslated(totalTranslatedWords);

      const thisWeek = getWeeklyTranslatedWordsCount(counts);
      const weeklyTotal = thisWeek.reduce((sum, day) => sum + day.count, 0);
      setWeeklyTranslated(weeklyTotal);
    });

    api.getUserActivityByDay((activity) => {
      setTotalReadingMinutes(calculateTotalReadingMinutes(activity.reading));

      const readingMinsPerWeek = calculateWeeklyReadingMinutes(activity.reading);
      setWeeklyReadingMinutes(readingMinsPerWeek);
    });

    api.getDailyStreak((data) => {
      setDaysPracticed(data.daily_streak);
    });

    api.getAllScheduledBookmarks(false, (bookmarks) => {
      setTotalInLearning(bookmarks.length);
    });

    api.totalLearnedBookmarks((totalLearnedCount) => {
      setTotalLearned(totalLearnedCount);
    });

    api.getPracticedBookmarksCountThisWeek((count) => {
      setWeeklyPracticed(count);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <s.DashboardContainer>
      <ProgressOverview />
    </s.DashboardContainer>
  );
}
