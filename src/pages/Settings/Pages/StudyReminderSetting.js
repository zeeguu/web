import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import { SectionHeading } from "./FeedPreferences.sc";
import * as s from "./StudyReminderSetting.sc";
import {
  allowReminders,
  loadReminderSetting,
  rescheduleStudyReminders,
  saveReminderSetting,
  syncReminderPreferences,
} from "../../../reminder/studyReminder";

// The daily study reminder's switch and time, on the Daily goal page (phone
// only): it reminds the learner on days they have not reached that goal yet.
export default function StudyReminderSetting({ goalMinutes }) {
  const api = useContext(APIContext);
  const [setting, setSetting] = useState(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    loadReminderSetting().then(setSetting);
  }, []);

  async function update(next) {
    setSetting(next);
    await saveReminderSetting(next);
    rescheduleStudyReminders({ goalMinutes });
    syncReminderPreferences(api, {}); // all of it: the learner just changed it
  }

  async function handleToggle(e) {
    const enabled = e.target.checked;
    if (enabled && !(await allowReminders())) {
      setBlocked(true);
      syncReminderPreferences(api, {}); // the permission, now known
      return;
    }
    setBlocked(false);
    update({ ...setting, enabled });
  }

  if (!setting) return null;

  return (
    <s.Reminder>
      <SectionHeading>Reminder</SectionHeading>
      <s.ReminderRow>
        <input id="study-reminder" type="checkbox" checked={setting.enabled} onChange={handleToggle} />
        <label htmlFor="study-reminder">Remind me at</label>
        <s.TimeInput
          type="time"
          aria-label="Reminder time"
          value={setting.time}
          disabled={!setting.enabled}
          onChange={(e) => e.target.value && update({ ...setting, time: e.target.value })}
        />
      </s.ReminderRow>
      <s.ReminderNote>Only on days you haven't reached your goal yet.</s.ReminderNote>
      {blocked && (
        <FullWidthInfoMsg>
          Notifications are off for Zeeguu. To get the reminder, turn them on in your phone's Settings → Zeeguu →
          Notifications.
        </FullWidthInfoMsg>
      )}
    </s.Reminder>
  );
}
