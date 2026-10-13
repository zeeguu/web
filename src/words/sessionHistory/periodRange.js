// The periods the History pages offer, and the dates each one covers.
// A preset is a number of days back or a calendar span; "custom" is a pair of
// yyyy-mm-dd dates the viewer picked, the second one included whole.

export const PRESETS = [
  { key: "7", label: "Last 7 days" },
  { key: "14", label: "Last 14 days" },
  { key: "30", label: "Last 30 days" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "182", label: "Last 6 months" },
  { key: "365", label: "Last year" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfWeek(now) {
  const monday = new Date(now);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - day + (day === 0 ? -6 : 1));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// { fromDate, toDate } for a period; null for a custom range not yet applied.
export function periodRange(period, custom, now = new Date()) {
  if (period === "week") return { fromDate: startOfWeek(now), toDate: now };
  if (period === "month") return { fromDate: new Date(now.getFullYear(), now.getMonth(), 1), toDate: now };
  if (period === "custom") {
    if (!custom?.from || !custom?.to) return null;
    // Local midnight to the end of the last day, not UTC midnight: "2026-10-10"
    // alone would parse as UTC and drop the evening west of Greenwich.
    const fromDate = new Date(`${custom.from}T00:00:00`);
    const toDate = new Date(`${custom.to}T23:59:59.999`);
    return { fromDate, toDate };
  }
  const days = Number(period) || 7;
  return { fromDate: new Date(now.getTime() - days * DAY_MS), toDate: now };
}

export function periodLabel(period, custom) {
  if (period === "custom") return custom?.from && custom?.to ? `${custom.from} to ${custom.to}` : "Custom range";
  return PRESETS.find((p) => p.key === period)?.label || "Last 7 days";
}

export function dateInputValue(date) {
  // yyyy-mm-dd in local time, for <input type="date">
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
