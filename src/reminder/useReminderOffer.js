import { useContext, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { savePreferences } from "../utils/preferences/savePreferences";
import ReminderOfferModal from "./ReminderOfferModal";
import { showsStreakCount } from "../utils/streakCountdown";
import { REMINDER_OFFER_EVENT, lastOfferedOn, noteOffered, shouldOfferReminder } from "./reminderOffer";
import {
  askAndReportPermission,
  notificationPermission,
  reminderSettingFrom,
  studyReminderAvailable,
} from "./studyReminder";

// The study reminder offered when the daily goal is reached: `offer(streak)`
// shows it if this phone should get it, and `offerModal` is to be rendered.
// `showOffer(streak)` shows it regardless (Developer tools).
// The learner's answer is logged as STUDY_REMINDER_OFFER: accepted, denied
// (said yes, then refused the phone's prompt) or not_now.
export default function useReminderOffer() {
  const api = useContext(APIContext);
  const { userPreferences, setUserPreferences } = useContext(UserContext);
  const { enabled, time } = reminderSettingFrom(userPreferences);
  const goalMinutes = parseInt(userPreferences?.daily_goal_minutes, 10) || null;
  const [streak, setStreak] = useState(null);

  async function offer(newStreak) {
    if (!studyReminderAvailable() || enabled || !goalMinutes) return;
    const permission = await notificationPermission();
    const now = new Date();
    if (
      !shouldOfferReminder({
        available: true,
        enabled,
        goalMinutes,
        permission,
        lastOfferedOn: lastOfferedOn(),
        now,
      })
    )
      return;
    noteOffered(now);
    setStreak(newStreak);
  }

  function showOffer(newStreak) {
    setStreak(newStreak);
  }

  function log(answer) {
    api.logUserActivity(REMINDER_OFFER_EVENT, "", answer, JSON.stringify({ streak }));
  }

  async function accept(chosenTime) {
    setStreak(null);
    if (!(await askAndReportPermission(api))) {
      log("denied");
      return;
    }
    log("accepted");
    savePreferences({
      api,
      preferences: userPreferences,
      setUserPreferences,
      changes: { study_reminder_enabled: "true", study_reminder_time: chosenTime },
    });
  }

  function decline() {
    setStreak(null);
    log("not_now");
  }

  const offerModal = (
    <ReminderOfferModal
      open={streak !== null}
      streak={streak}
      showStreakCount={showsStreakCount(userPreferences)}
      time={time}
      onAccept={accept}
      onDecline={decline}
    />
  );
  return { offer, showOffer, offerModal };
}
