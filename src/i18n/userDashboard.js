import LocalizedStrings from "localized-strings";

let compactFormat = {
  userDashboardTitle: {
    en: "Dashboard",
    da: "Dashboard",
  },
  minutes: {
    en: "minutes",
    da: "minutter",
  },
  last7days: {
    en: "Last 7 days",
    da: "",
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
