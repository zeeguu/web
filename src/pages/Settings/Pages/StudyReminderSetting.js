import { useContext, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash-es/debounce";
import { Checkbox, FormControlLabel } from "@mui/material";
import { APIContext } from "../../../contexts/APIContext";
import { UserContext } from "../../../contexts/UserContext";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import { SectionContainer, SectionHeading } from "./FeedPreferences.sc";
import * as s from "./StudyReminderSetting.sc";
import { allowReminders, reminderSettingFrom } from "../../../reminder/studyReminder";

// The daily study reminder's switch and time, on the Notifications page (phone
// only): it reminds the learner on days they have not reached their daily goal.
// The setting is a preference like any other; useStudyReminder schedules the
// reminders from it.
export default function StudyReminderSetting() {
  const api = useContext(APIContext);
  const { userPreferences, setUserPreferences } = useContext(UserContext);
  const { enabled, time } = reminderSettingFrom(userPreferences);
  const goalMinutes = parseInt(userPreferences?.daily_goal_minutes, 10) || null;
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState(false);

  // Shown at once, saved optimistically; a failed save is undone unless
  // something newer (another change, logging out) replaced it meanwhile.
  function save(changes) {
    if (!userPreferences?.daily_goal_minutes) return; // not loaded, or logged out
    const before = userPreferences;
    const after = { ...userPreferences, ...changes };
    setError(false);
    setUserPreferences(after);
    api.saveUserPreferences(changes, undefined, () => {
      setUserPreferences((current) => (current === after ? before : current));
      setError(true);
    });
  }
  const saveRef = useRef(save);
  saveRef.current = save;

  // The time being typed or wheeled shows at once and is saved once it
  // settles, or when the page or the app is left.
  const [shownTime, setShownTime] = useState(time);
  useEffect(() => setShownTime(time), [time]);
  const saveTime = useMemo(() => debounce((value) => saveRef.current({ study_reminder_time: value }), 800), []);
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && saveTime.flush();
    document.addEventListener("visibilitychange", onHide);
    let appListener = null;
    import("@capacitor/app")
      .then(({ App }) => App.addListener("appStateChange", ({ isActive }) => !isActive && saveTime.flush()))
      .then((handle) => (appListener = handle))
      .catch(() => {});
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      appListener?.remove();
      saveTime.flush();
    };
  }, [saveTime]);

  function handleTimeChange(e) {
    if (!e.target.value) return;
    setShownTime(e.target.value);
    saveTime(e.target.value);
  }

  async function handleToggle(e) {
    const turnOn = e.target.checked;
    if (turnOn && !(await allowReminders())) {
      setBlocked(true);
      api.saveUserPreferences({ notifications_permission: "denied" });
      return;
    }
    setBlocked(false);
    saveTime.flush(); // the time on screen goes first
    save(
      turnOn
        ? { study_reminder_enabled: "true", notifications_permission: "granted" }
        : { study_reminder_enabled: "false" },
    );
  }

  return (
    <SectionContainer>
      <SectionHeading>Study reminder</SectionHeading>
      <s.ReminderRow>
        <FormControlLabel
          control={<Checkbox checked={enabled} onChange={handleToggle} />}
          label="Remind me at"
          sx={{ marginRight: 0, "& .MuiTypography-root": { fontFamily: "inherit" } }}
        />
        <s.TimeInput
          type="time"
          aria-label="Reminder time"
          value={shownTime}
          disabled={!enabled}
          onChange={handleTimeChange}
        />
      </s.ReminderRow>
      <s.ReminderNote>
        Only on days you haven't reached your daily goal{goalMinutes ? ` of ${goalMinutes} minutes` : ""} yet.
      </s.ReminderNote>
      {blocked && (
        <FullWidthInfoMsg>
          Notifications are off for Zeeguu. To get the reminder, turn them on in your phone's Settings → Zeeguu →
          Notifications.
        </FullWidthInfoMsg>
      )}
      {error && <FullWidthErrorMsg>Couldn't save your reminder. Please try again.</FullWidthErrorMsg>}
    </SectionContainer>
  );
}
