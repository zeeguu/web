import Pluralize from "../text/pluralize";
function secondsToMinutes(timeInSeconds) {
  return Math.floor(timeInSeconds / 60);
}
function secondsToHours(timeInSeconds) {
  return Math.floor(secondsToMinutes(timeInSeconds) / 60);
}
function secondsToDays(timeInSeconds) {
  return Math.floor(secondsToHours(timeInSeconds) / 24);
}

function twoDigitNumber(number) {
  return number > 9 ? number + "" : "0" + number;
}

function timeToDigitalClock(timeInSeconds, precision = "minutes") {
  // Currently supports two precision:
  // "minutes" : 01:23
  // "hours" : 04:23:54
  if (timeInSeconds < 60) {
    if (precision === "minutes") return "00:" + twoDigitNumber(timeInSeconds);
    else if (precision === "hours")
      return "00:00:" + twoDigitNumber(timeInSeconds);
  } else {
    let seconds = timeInSeconds % 60;
    let minutes = secondsToMinutes(timeInSeconds);
    let hours = secondsToHours(timeInSeconds);
    if (precision === "minutes")
      return `${twoDigitNumber(minutes)}:${twoDigitNumber(seconds)}`;
    else if (precision === "hours")
      return `${twoDigitNumber(hours)}:${twoDigitNumber(minutes)}:${twoDigitNumber(seconds)}`;
  }
}

function timeToHumanReadable(timeInSeconds, precision = "seconds") {
  // Currently supports two precision: "seconds" and "minutes"
  if (timeInSeconds < 60) {
    if (precision === "seconds")
      return timeInSeconds + (timeInSeconds > 1 ? " seconds" : " second");
    else return "< 1 minute";
  } else {
    let seconds = timeInSeconds % 60;
    let minutes = secondsToMinutes(timeInSeconds);
    let string = minutes + " " + Pluralize.minute(minutes);
    if (seconds > 0 && precision === "seconds")
      string += " " + seconds + " " + Pluralize.second(seconds);
    return string;
  }
}

function estimateReadingTime(wordCount) {
  // 238 words per minute is average for a normal reader in English.
  // Let'say a language lerner takes 160 WPM + Wait + Translation Words
  return timeToHumanReadable(Math.ceil(wordCount / 160) * 60, "minutes");
}

/**
 * Converts a future date to a human-friendly "come back" message.
 * Returns phrases like "in half an hour", "tomorrow", etc.
 * @param {Date} futureDate - The date when new words will be ready
 * @returns {string} Human-friendly time description
 */
function formatFutureDueTime(futureDate) {
  const now = new Date();
  const diffMs = futureDate - now;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = diffMinutes / 60;

  // Check if it's tomorrow (different calendar day)
  const isNextDay = futureDate.getDate() !== now.getDate() ||
                    futureDate.getMonth() !== now.getMonth() ||
                    futureDate.getFullYear() !== now.getFullYear();

  if (diffMinutes <= 45) {
    return "in half an hour";
  } else if (diffMinutes <= 90) {
    return "in about an hour";
  } else if (diffHours <= 3) {
    return "in a couple of hours";
  } else if (diffHours <= 6) {
    return "in a few hours";
  } else if (!isNextDay) {
    return "later today";
  } else if (diffHours <= 36) {
    return "tomorrow";
  } else if (diffHours <= 60) {
    return "in a couple of days";
  } else {
    const days = Math.round(diffHours / 24);
    return `in ${days} days`;
  }
}

export {
  secondsToMinutes,
  secondsToHours,
  secondsToDays,
  timeToHumanReadable,
  timeToDigitalClock,
  estimateReadingTime,
  formatFutureDueTime,
};
