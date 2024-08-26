function secondsToMinutes(timeInSeconds) {
  return Math.floor(timeInSeconds / 60);
}
function secondsToHours(timeInSeconds) {
  return Math.floor(secondsToMinutes(timeInSeconds) / 60);
}
function secondsToDays(timeInSeconds) {
  return Math.floor(secondsToHours(timeInSeconds) / 24);
}

function getHumanRoundedTime(timeInSeconds, precision = "seconds") {
  // Currently supports precision: "seconds", "minutes", "hours", "days"
  let valid_precision = ["seconds", "minutes", "hours", "days"];
  if (!valid_precision.includes(precision))
    throw `getHumanRoundedTime called with: '${precision}' it supports: ${valid_precision}`;
  if (precision === "seconds")
    return timeInSeconds + (timeInSeconds > 1 ? " seconds" : " second");
  if (timeInSeconds < 60) {
    if (precision === "minutes") return "< 1 minute";
    else if (precision === "hours") return "< 1 hour";
    else return "< 1 day";
  } else {
    let days = secondsToDays(timeInSeconds);
    let hours = secondsToHours(timeInSeconds);
    let minutes = secondsToMinutes(timeInSeconds);
    if (precision === "minutes")
      return minutes + (minutes > 1 ? " minutes" : " minute");
    else if (precision === "hours") {
      if (hours === 0) {
        return "< 1 hour";
      }
      return hours + (hours > 1 ? " hours" : " hour");
    } else {
      if (days === 0) {
        return "< 1 day";
      }
      return days + (days > 1 ? " days" : " day");
    }
  }
}

function timeToHumanReadable(timeInSeconds, precision = "seconds") {
  // Currently supports two precision: "seconds" and "minutes"
  if (timeInSeconds < 60) {
    if (precision === "seconds")
      return timeInSeconds + (timeInSeconds > 1 ? " seconds" : " second");
    else return "< 1 minute";
  } else {
    let minutes = secondsToHours(timeInSeconds);
    let seconds = timeInSeconds % 60;
    let string = minutes + (minutes > 1 ? " minutes" : " minute");
    if (seconds > 0 && precision === "seconds")
      string += " " + seconds + (seconds > 1 ? " seconds" : " second");
    return string;
  }
}

function estimateReadingTime(wordCount) {
  // 238 words per minute is average for a normal reader in English.
  // Let'say a language lerner takes 160 WPM + Wait + Translation Words
  return timeToHumanReadable(Math.ceil(wordCount / 160) * 60, "minutes");
}
export {
  secondsToMinutes,
  secondsToHours,
  secondsToDays,
  getHumanRoundedTime,
  timeToHumanReadable,
  estimateReadingTime,
};
