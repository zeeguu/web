import { useContext, useEffect, useMemo, useState } from "react";
import debounce from "lodash-es/debounce";
import { Checkbox, FormControlLabel } from "@mui/material";
import { APIContext } from "../../../contexts/APIContext";
import { UserContext } from "../../../contexts/UserContext";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import { SectionContainer, SectionHeading } from "./FeedPreferences.sc";
import * as s from "./StudyReminderSetting.sc";
import { ChangeLink } from "./AikiMode.sc"; // the same inline action
import { allowReminders, notificationPermission, reminderSettingFrom } from "../../../reminder/studyReminder";
import { onAppPause } from "../../../utils/misc/onAppResume";

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
  // something newer (another change, logging out) replaced it meanwhile. Each
  // change applies to the preferences as they are when it lands, so two quick
  // changes (a time, then the switch) both stay.
  function save(changes) {
    const keys = Object.keys(changes);
    let previous = null;
    setError(false);
    setUserPreferences((current) => {
      if (!current?.daily_goal_minutes) return current; // not loaded, or logged out
      previous = Object.fromEntries(keys.map((key) => [key, current[key]]));
      return { ...current, ...changes };
    });
    api.saveUserPreferences(
      changes,
      () => {},
      () => {
        setUserPreferences((current) =>
          previous && keys.every((key) => current?.[key] === changes[key]) ? { ...current, ...previous } : current,
        );
        setError(true);
      },
    );
  }

  // The time being typed or wheeled shows at once and is saved once it
  // settles, or when the page or the app is left.
  const [shownTime, setShownTime] = useState(time);
  useEffect(() => setShownTime(time), [time]);
  const saveTime = useMemo(() => debounce((value) => save({ study_reminder_time: value }), 800), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && saveTime.flush();
    document.addEventListener("visibilitychange", onHide);
    const stopListening = onAppPause(() => saveTime.flush());
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      stopListening();
      saveTime.flush();
    };
  }, [saveTime]);

  function handleTimeChange(e) {
    if (!e.target.value) return;
    setShownTime(e.target.value);
    saveTime(e.target.value);
  }

  // This phone may not have been asked yet: the setting follows the learner,
  // but each phone needs its own permission.
  const [permission, setPermission] = useState(null);
  useEffect(() => {
    notificationPermission().then(setPermission);
  }, []);

  async function askPermission() {
    const allowed = await allowReminders();
    const now = allowed ? "granted" : "denied";
    setPermission(now);
    setBlocked(!allowed);
    api.saveUserPreferences({ notifications_permission: now }, () => {});
    return allowed;
  }

  async function handleToggle(e) {
    const turnOn = e.target.checked;
    if (turnOn && !(await askPermission())) return;
    setBlocked(false);
    saveTime.flush(); // the time on screen goes first
    save({ study_reminder_enabled: turnOn ? "true" : "false" });
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
      {enabled && !blocked && permission && permission !== "granted" && (
        <FullWidthInfoMsg>
          This phone hasn't been allowed to show notifications yet.{" "}
          <ChangeLink onClick={askPermission}>Allow notifications</ChangeLink>
        </FullWidthInfoMsg>
      )}
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
