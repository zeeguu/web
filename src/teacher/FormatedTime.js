import strings from "../i18n/definitions";

export const convertToHoursMinSec = (accumulatedTime) => {
  const hours = Math.floor(accumulatedTime / 3600);
  const minutes = Math.floor((accumulatedTime / 60) % 60);
  const seconds = Math.round(accumulatedTime - hours * 3600 - minutes * 60);
  return { hours, minutes, seconds };
};

export const convertTime = (accumulatedTime, setTime) => {
  const { hours, minutes, seconds } = convertToHoursMinSec(accumulatedTime);
  if (accumulatedTime < 60) {
    setTime(seconds + "s");
  } else {
    hours < 1
      ? setTime(minutes + "m")
      : setTime(hours + strings.hours + minutes + "m");
  }
};

export const convertTimeForActivityBar = (accumulatedTime, setTime) => {
  const time = convertToHoursMinSec(accumulatedTime);
  if (accumulatedTime < 240) {
    setTime("");
  } else {
    time.hours < 1 ? setTime(time.minutes + "m") : setTime(time.hours + strings.hours + time.minutes + "m");
  }
};

export const convertExactTimeString = (accumulatedTime) => {
  const { hours, minutes, seconds } = convertToHoursMinSec(accumulatedTime);
  if (hours > 0) return hours + strings.hours + minutes + "m " + seconds + "s";
  if (accumulatedTime < 60) return seconds + "s";
  return minutes + "m " + seconds + "s";
};

//This should be localised STRINGS
export const timeExplanation = (student) => {
  const readingTime = convertExactTimeString(student.reading_time);
  const exerciseTime = convertExactTimeString(student.exercise_time);
  return (
    <div>
      <p>
        {strings.exactReadingTime} {readingTime}
      </p>
      <p>
        {strings.exactExerciseTime} {exerciseTime}
      </p>
    </div>
  );
};
