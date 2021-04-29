import {
  eachMonthOfInterval,
  subDays,
  format,
  getYear,
  getMonth,
  eachDayOfInterval,
  subYears,
} from "date-fns";
import {
  PERIOD_OPTIONS,
  DATE_FORMAT,
  ACTIVITY_TIME_FORMAT_OPTIONS,
} from "../../ConstantsUserDashboard";
import { calculatePerMonth } from "./CommonDataFormat";

/**
 *
 * Function that transforms an array of pairs to
 * a map of type key->value
 *
 * To be used for the ReadingAndExercisesTimeGraph
 *
 * @param {Array} data
 *
 * Array containing pairs of dates and second counts
 * as received from the API for reading and exercises user activity
 *
 * [{date:dateString1, seconds: secondsCount1}, {date:dateString2, seconds: secondsCount2}, {date:dateString3, seconds: secondsCount3}, …]
 *
 * example:
 * (451)[{…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
 *
 * example entries:
 * 0:{date: '2018-03-02', seconds: 1223}
 * 1:{date: '2018-03-03', seconds: 2534}
 * 2:{date: '2018-03-05', seconds: 5498}
 *
 * @returns {Map}
 *
 * Returns a map with the date values as key and seconds count as value
 * Map() {date1 => secondsCount1, date2 => secondsCount2, date3 => secondsCount3, …}
 *
 * example:
 * Map(451) {2018-03-02 => 1223, 2018-03-03 => 2534, 2018-03-05 => 5498, 2018-03-06 => 5991, 2018-03-07 => 2935, …}
 */
function getMapData(data) {
  var result = new Map();

  data.forEach((row) => {
    result.set(row.date, row.seconds);
  });

  return result;
}

function secondsToMinutes(seconds) {
  return Math.round(seconds / 60);
}

function secondsToHours(seconds) {
  return Math.round((seconds / 3600) * 10) / 10; //multiplied by 10 and divided by 10 to get the first decimal
}

function formatSeconds(seconds, formatTo) {
  switch (formatTo) {
    case ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES:
      return secondsToMinutes(seconds);
    case ACTIVITY_TIME_FORMAT_OPTIONS.HOURS:
      return secondsToHours(seconds);
    default:
      return secondsToMinutes(seconds);
  }
}

function getDataForInterval(
  data,
  startDate,
  endDate,
  dateFormatString,
  activeTimeFormatOption
) {
  var result = [];

  var dates = eachDayOfInterval({ start: startDate, end: endDate });

  var readingData = data.reading;
  var exercisesData = data.exercises;

  dates.forEach((day) => {
    var stringDate = format(day, DATE_FORMAT);
    var stringlegend = format(day, dateFormatString);

    var readingCount = readingData.find((entry) => entry.date === stringDate)
      ? readingData.find((entry) => entry.date === stringDate).seconds
      : 0;

    var exercisesCount = exercisesData.find(
      (entry) => entry.date === stringDate
    )
      ? exercisesData.find((entry) => entry.date === stringDate).seconds
      : 0;

    result.push({
      date: stringlegend,
      reading_time: formatSeconds(readingCount, activeTimeFormatOption),
      exercises_time: formatSeconds(exercisesCount, activeTimeFormatOption),
    });
  });

  return result;
}

function getBarDataForWeek(data, dateInWeek, activeTimeFormatOption) {
  const STRING_FORMAT = "dd-MM";

  var datesCurrentWeek = {
    start: subDays(dateInWeek, 6),
    end: dateInWeek,
  };

  return getDataForInterval(
    data,
    datesCurrentWeek.start,
    datesCurrentWeek.end,
    STRING_FORMAT,
    activeTimeFormatOption
  );
}

function getBarDataForMonth(data, dateInMonth, activeTimeFormatOption) {
  const STRING_FORMAT = "dd-MM";

  var datesCurrentMonth = {
    start: subDays(dateInMonth, 30),
    end: dateInMonth,
  };

  return getDataForInterval(
    data,
    datesCurrentMonth.start,
    datesCurrentMonth.end,
    STRING_FORMAT,
    activeTimeFormatOption
  );
}

function getBarDataForYear(dataPerMonths, dateInYear, activeTimeFormatOption) {
  var result = [];

  const STRING_FORMAT = "MMM-yy";

  var dates = eachMonthOfInterval({
    start: subYears(dateInYear, 1),
    end: dateInYear,
  });

  var readingData = dataPerMonths.reading;
  var exercisesData = dataPerMonths.exercises;

  dates.forEach((day) => {
    var stringLegend = format(day, STRING_FORMAT);

    var year = getYear(day);
    var month = getMonth(day);

    var readingCount = readingData.has(year)
      ? readingData.get(year).has(month)
        ? readingData.get(year).get(month)
        : 0
      : 0;

    var exercisesCount = exercisesData.has(year)
      ? exercisesData.get(year).has(month)
        ? exercisesData.get(year).get(month)
        : 0
      : 0;

    result.push({
      date: stringLegend,
      reading_time: formatSeconds(readingCount, activeTimeFormatOption),
      exercises_time: formatSeconds(exercisesCount, activeTimeFormatOption),
    });
  });

  return result;
}

function getBarDataForYears(dataPerMonths, dateInYear, activeTimeFormatOption) {
  var result = [];

  const STRING_FORMAT = "yyyy";

  var readingData = dataPerMonths.reading;
  var exercisesData = dataPerMonths.exercises;

  while (true) {
    var year = getYear(dateInYear);

    var stringLegend = format(dateInYear, STRING_FORMAT);

    if (!readingData.has(year) && !exercisesData.has(year)) {
      break;
    } else {
      var readingCount = 0;
      var exercisesCount = 0;

      if (readingData.has(year)) {
        for (const [, value] of readingData.get(year).entries()) {
          readingCount += value;
        }
      }

      if (exercisesData.has(year)) {
        for (const [, value] of exercisesData.get(year).entries()) {
          exercisesCount += value;
        }
      }

      result.push({
        date: stringLegend,
        reading_time: formatSeconds(readingCount, activeTimeFormatOption),
        exercises_time: formatSeconds(exercisesCount, activeTimeFormatOption),
      });

      dateInYear = subYears(dateInYear, 1);
    }
  }

  return result.reverse();
}

/**
 *
 * Function to calculate cumulative count per months for available years
 * for reading and exercise time
 *
 * This calculation is done only once, together with receiving the data from the API
 * and then saved in the state in UserDashboard.js
 *
 * @param {Object} data
 *
 * Object containing two pairs of type key->value (value of type Array)
 * for the reading and exercises time for the Zeeguu user;
 * data is exactly as received from the API
 *
 * example:
 * {reading: Array(451), exercises: Array(335)}
 *
 * example of entries for data.reading or data.exercises:
 * 0:{date: '2017-06-06', seconds: 8}
 * 1:{date: '2017-06-09', seconds: 3}
 * 2:{date: '2017-06-10', seconds: 11}
 *
 * @returns {Object}
 *
 * Returns an object containing two pairs of type key->value (value of type Map)
 * the value is changed from Array to Map by using the function _calculatePerMonth_
 * from CommonDataFormat.js
 *
 * example:
 * {reading: Map(4), exercises: Map(5)}
 *
 */
function calculateCountPerMonth_Activity(data) {
  var readingMap = calculatePerMonth(getMapData(data.reading));
  var exercisesMap = calculatePerMonth(getMapData(data.exercises));

  return { reading: readingMap, exercises: exercisesMap };
}

/**
 * Function to return the Array data for the ReadingAndExercisesTimeGraph
 * depending on the different options selected from
 * the dropdowns in UserDashboard
 *
 * @param {Object} data
 *
 * Object containing data for reading and exercises times
 *
 * example:
 * {reading: Array(451), exercises: Array(335)}
 *
 * @param {Object} countPerMonths
 *
 * Object representing the cumuliative count per months for the available years
 * for reading and exercises time data
 *
 * example:
 * {reading: Map(4), exercises: Map(5)}
 *
 * @param {String} period
 *
 * String representing the selected time interval
 *
 * example:
 * '7 days'
 *
 * @param {Date} dateInPeriod
 *
 * Date object representing the last date in the chosen time interval
 *
 * example:
 * Thu Apr 22 2021 14:54:40 GMT+0200 (Central European Summer Time)
 *
 * @param {String} activeTimeFormatOption
 *
 * String representing the chosen time format option
 *
 * example:
 * 'Minutes'
 *
 * @returns {Array}
 *
 * Returns an array with data to be given to the Nivo graph
 *
 * example:
 * (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
 * 0:{date: '16-04', reading_time: 0, exercises_time: 0}
 * 1:{date: '17-04', reading_time: 3, exercises_time: 0}
 * 2:{date: '18-04', reading_time: 0, exercises_time: 0}
 * …
 *
 */
function getBarGraphData(
  data,
  countPerMonths,
  period,
  dateInPeriod,
  activeTimeFormatOption
) {
  switch (period) {
    case PERIOD_OPTIONS.WEEK:
      return getBarDataForWeek(data, dateInPeriod, activeTimeFormatOption);
    case PERIOD_OPTIONS.MONTH:
      return getBarDataForMonth(data, dateInPeriod, activeTimeFormatOption);
    case PERIOD_OPTIONS.YEAR:
      return getBarDataForYear(
        countPerMonths,
        dateInPeriod,
        activeTimeFormatOption
      );
    case PERIOD_OPTIONS.YEARS:
      return getBarDataForYears(
        countPerMonths,
        dateInPeriod,
        activeTimeFormatOption
      );
    default:
      return getBarDataForWeek(data, new Date(), activeTimeFormatOption);
  }
}

export { getBarGraphData, calculateCountPerMonth_Activity };
