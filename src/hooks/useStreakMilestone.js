import { useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { ProgressContext } from "../contexts/ProgressContext";
import strings from "../i18n/definitions";

const MILESTONES = [2, 3, 5, 7, 14, 30, 50, 100, 200, 365];

function getMilestoneMessage(days) {
  let suffix;
  if (days >= 365) suffix = strings.streakMilestoneYear;
  else if (days >= 100) suffix = strings.streakMilestoneTripleDigits;
  else if (days >= 50) suffix = strings.streakMilestoneHalfway;
  else if (days >= 30) suffix = strings.streakMilestoneMonth;
  else if (days >= 14) suffix = strings.streakMilestoneTwoWeeks;
  else if (days >= 7) suffix = strings.streakMilestoneWeek;
  else if (days >= 5) suffix = strings.streakMilestoneAlmostWeek;
  else if (days >= 3) suffix = strings.streakMilestoneKeepGoing;
  else suffix = strings.streakMilestoneGreatStart;

  return `${days} ${strings.streakDayStreak}! ${suffix}`;
}

export default function useStreakMilestone() {
  const { daysPracticed } = useContext(ProgressContext);

  useEffect(() => {
    if (!daysPracticed || daysPracticed <= 0) return;
    if (!MILESTONES.includes(daysPracticed)) return;

    const today = new Date().toDateString();
    const storageKey = "lastMilestoneShown";
    const lastShown = localStorage.getItem(storageKey);

    // Only show once per day per milestone value
    const lastRecord = lastShown ? JSON.parse(lastShown) : {};
    if (lastRecord.date === today && lastRecord.streak === daysPracticed) return;

    // Delay slightly so the app has settled
    const timer = setTimeout(() => {
      toast(`🔥 ${getMilestoneMessage(daysPracticed)}`, {
        autoClose: 4000,
      });
      localStorage.setItem(
        storageKey,
        JSON.stringify({ date: today, streak: daysPracticed })
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [daysPracticed]);
}
