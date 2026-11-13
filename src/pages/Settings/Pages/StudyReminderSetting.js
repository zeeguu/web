import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { Checkbox, FormControlLabel } from "@mui/material";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import { SectionContainer, SectionHeading } from "./FeedPreferences.sc";
import * as s from "./StudyReminderSetting.sc";
import {
  allowReminders,
  loadReminderSetting,
  rescheduleStudyReminders,
  saveReminderSetting,
  syncReminderPreferences,
} from "../../../reminder/studyReminder";

// The daily study reminder's switch and time, on the Notifications page (phone
// only): it reminds the learner on days they have not reached their daily goal.
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
    <SectionContainer>
      <SectionHeading>Study reminder</SectionHeading>
      <s.ReminderRow>
        <FormControlLabel
          control={<Checkbox checked={setting.enabled} onChange={handleToggle} />}
          label="Remind me at"
          sx={{ marginRight: 0, "& .MuiTypography-root": { fontFamily: "inherit" } }}
        />
        <s.TimeInput
          type="time"
          aria-label="Reminder time"
          value={setting.time}
          disabled={!setting.enabled}
          onChange={(e) => e.target.value && update({ ...setting, time: e.target.value })}
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
    </SectionContainer>
  );
}
