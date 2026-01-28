import { useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { ProgressContext } from "../contexts/ProgressContext";

const MILESTONES = [2, 3, 5, 7, 14, 30, 50, 100, 200, 365];

function getMilestoneMessage(days) {
  if (days >= 365) return `${days} days! A whole year of learning!`;
  if (days >= 100) return `${days} days! Triple digits!`;
  if (days >= 50) return `${days}-day streak! Halfway to 100!`;
  if (days >= 30) return `${days} days! A full month!`;
  if (days >= 14) return `${days}-day streak! Two weeks strong!`;
  if (days >= 7) return `${days}-day streak! A full week!`;
  if (days >= 5) return `${days}-day streak! Almost a week!`;
  if (days >= 3) return `${days}-day streak! Keep it going!`;
  return `${days}-day streak! Great start!`;
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
