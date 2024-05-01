function timeToHumanReadable(timeInSeconds) {
  if (timeInSeconds < 60) {
    return timeInSeconds + (timeInSeconds > 1 ? " seconds" : " second");
  } else {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    let string = minutes + (minutes > 1 ? " minutes" : " minute");
    if (seconds > 0)
      string += " " + seconds + (seconds > 1 ? " seconds" : " second");
    return string;
  }
}
export { timeToHumanReadable };
