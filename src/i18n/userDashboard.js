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
  helperTextActivity: {
    en: "Your activity data for ",
    da: "Dit aktivitet data for ",
  },
  helperTextWords: {
    en: "Your number of translated words for ",
    da: "Dine oversatte ord for ",
  },
  helperTextTimeCount: {
    en: "Time count shown in ",
    da: "Brugt tid vises i ",
  },
  wordsGraphLegendWeek: {
    en: "Number of Translated Words for 7 days",
    da: "Oversatte ord for 7 dage",
  },
  wordsGraphLegendMonth: {
    en: "Number of Translated Words for 30 Days",
    da: "Oversatte ord for 30 dage",
  },
  wordsGraphLegendYear: {
    en: "Number of Translated Words for 12 Months",
    da: "Oversatte ord for 12 måneder",
  },
  wordsGraphLegendYears: {
    en: "Number of Translated Words for Available Years",
    da: "Oversatte ord for tilgængelige år",
  },
  feedbackButtonText: {
    en: "Do you have some feedback for us?",
    da: "Har du noget feedback for os?",
  },
  feedbackAlertText: {
    en: "\n The User Dashboard is a new Zeeguu feature that we are working on. \n\nWrite here any feedback you want to send us. \n\nThank you in advance! \n",
    da: "\n Denne er en ny Zeeguu funktion, vi arbejder på. \n\nSkriv til os her, hvis du har noget feedback, du gerne vil dele med os. \n På forhånd tak!",
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
