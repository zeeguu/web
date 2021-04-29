import LocalizedStrings from "localized-strings";

let compactFormat = {
  userDashboardTitle: {
    en: "Dashboard",
    da: "Dashboard",
  },
  tabActivity: {
    en: "Activity",
    da: "Aktivitet",
  },
  tabWords: {
    en: "Words",
    da: "Ord",
  },
  minutes: {
    en: "minutes",
    da: "minutter",
  },
  hours: {
    en: "hours",
    da: "timer",
  },
  last7days: {
    en: "Last 7 days",
    da: "Sidste 7 dage",
  },
  last30days: {
    en: "Last 30 days",
    da: "Sidste 30 dage",
  },
  last12months: {
    en: "Last 12 months",
    da: "Sidste 12 måneder",
  },
  availableYears: {
    en: "Available years",
    da: "Tilgængelige år",
  },
  custom7DaysUntil: {
    en: "7 days until",
    da: "7 dage indtil d.",
  },
  custom30DaysUntil: {
    en: "30 days until",
    da: "30 dage indtil d.",
  },
  custom12MonthsUntil: {
    en: "12 months until",
    da: "12 måneder indtil d.",
  },
};

function invertKeysInDict(dict) {
  let result = { en: {}, da: {} };

  for (const [key, value] of Object.entries(dict)) {
    result.en[key] = value.en;
    result.da[key] = value.da;
  }
  return result;
}

let udstrings = new LocalizedStrings(invertKeysInDict(compactFormat));

export default udstrings;
