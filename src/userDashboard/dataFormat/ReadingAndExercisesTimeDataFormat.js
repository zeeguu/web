import { eachMonthOfInterval, subDays, format, getYear, getMonth, eachDayOfInterval, subYears } from 'date-fns';
import { PERIOD_OPTIONS, DATE_FORMAT, ACTIVITY_TIME_FORMAT_OPTIONS } from "./ConstantsUserDashboard";
import { calculatePerMonth } from "./CommonDataFormat";

function getMapData(data){

  var result = new Map();
  
  data.forEach(
    (row) => {
      result.set(row.date, row.seconds);
    }
  );

  return result;

}

function secondsToMinutes(seconds){

  return Math.round(seconds / 60);

}

function secondsToHours(seconds){

  return Math.round((seconds / 3600) * 10)/10; //multiplied by 10 and divided by 10 to get the first decimal

}

function formatSeconds(seconds, formatTo){

  switch(formatTo){
      case ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES:
        return secondsToMinutes(seconds); 
      case ACTIVITY_TIME_FORMAT_OPTIONS.HOURS:
        return secondsToHours(seconds); 
      default:
        return secondsToMinutes(seconds);
  }

}

function getDataForInterval(data, startDate, endDate, dateFormatString, activeTimeFormatOption){

  var result = [];

  var dates = eachDayOfInterval(
    { start: startDate, end: endDate}
  )

  var readingData = data.reading;
  var exercisesData = data.exercises;

  dates.forEach(day => {

    var stringDate = format(day, DATE_FORMAT);
    var stringlegend = format(day, dateFormatString); 

    var readingCount = readingData.find(entry => entry.date === stringDate) ? 
                            readingData.find(entry => entry.date === stringDate).seconds
                            : 0;
    
    var exercisesCount = exercisesData.find(entry => entry.date === stringDate) ? 
                            exercisesData.find(entry => entry.date === stringDate).seconds
                            : 0;
                            
    result.push({ date: stringlegend, reading_time: formatSeconds(readingCount, activeTimeFormatOption), exercises_time: formatSeconds(exercisesCount, activeTimeFormatOption)});

  });

  return result; 

}


function getBarDataForWeek(data, dateInWeek, activeTimeFormatOption){

  const STRING_FORMAT = "dd-MM"; 

  var datesCurrentWeek = {
      start: subDays(dateInWeek, 6),
      end: dateInWeek
  };

  return  getDataForInterval(data, datesCurrentWeek.start, datesCurrentWeek.end, STRING_FORMAT, activeTimeFormatOption);

}

function getBarDataForMonth(data, dateInMonth, activeTimeFormatOption){

  const STRING_FORMAT = "dd-MM"; 

  var datesCurrentMonth = {
      start: subDays(dateInMonth, 30),
      end: dateInMonth
  };

  return getDataForInterval(data, datesCurrentMonth.start, datesCurrentMonth.end, STRING_FORMAT, activeTimeFormatOption);

}

function getBarDataForYear(dataPerMonths, dateInYear, activeTimeFormatOption){

  var result = [];

  const STRING_FORMAT = "MMM-yy"; 

  var dates = eachMonthOfInterval(
    { start: subYears(dateInYear, 1), end: dateInYear}
  )

  var readingData = dataPerMonths.reading;
  var exercisesData = dataPerMonths.exercises;

  dates.forEach(day => {

    var stringLegend = format(day, STRING_FORMAT); 

    var year = getYear(day);
    var month = getMonth(day);

    var readingCount = readingData.has(year) ?
                        readingData.get(year).has(month) ?
                          readingData.get(year).get(month)
                            : 0
                            : 0 ;
    
    var exercisesCount = exercisesData.has(year) ?
                          exercisesData.get(year).has(month) ?
                            exercisesData.get(year).get(month)
                              : 0
                              : 0 ;
                            
    result.push({ date: stringLegend, reading_time: formatSeconds(readingCount, activeTimeFormatOption), exercises_time: formatSeconds(exercisesCount, activeTimeFormatOption)});

  });

  return result;

}

function getBarDataForYears(dataPerMonths, dateInYear, activeTimeFormatOption){
  
  var result = [];

  const STRING_FORMAT = "yyyy"; 

  var readingData = dataPerMonths.reading;
  var exercisesData = dataPerMonths.exercises;

  while(true){

    var year = getYear(dateInYear);

    var stringLegend = format(dateInYear, STRING_FORMAT); 

    if ( !readingData.has(year) && !exercisesData.has(year) ){

      break;

    }

    else{

      var readingCount = 0;
      var exercisesCount = 0;

      if (readingData.has(year)){
        for (const [ , value] of readingData.get(year).entries()) {
          readingCount += value;
        }
      }

      if (exercisesData.has(year)){
        for (const [ , value] of exercisesData.get(year).entries()) {
          exercisesCount += value;
        }
      }

      result.push({ date: stringLegend, reading_time: formatSeconds(readingCount, activeTimeFormatOption), exercises_time: formatSeconds(exercisesCount, activeTimeFormatOption)});
          
      dateInYear = subYears(dateInYear, 1);

    }
  }

  return result.reverse();

}


function calculateCountPerMonth_Activity(data){

  var readingMap = calculatePerMonth(getMapData(data.reading));
  var exercisesMap =  calculatePerMonth(getMapData(data.exercises));

  return ({reading: readingMap, exercises: exercisesMap});

}

function getBarGraphData(data, countPerMonths, period, dateInPeriod, activeTimeFormatOption){
    
    switch(period) {
      case PERIOD_OPTIONS.WEEK:
        return getBarDataForWeek(data, dateInPeriod, activeTimeFormatOption); 
      case PERIOD_OPTIONS.MONTH:
        return getBarDataForMonth(data, dateInPeriod, activeTimeFormatOption); 
      case PERIOD_OPTIONS.YEAR:
        return getBarDataForYear(countPerMonths, dateInPeriod, activeTimeFormatOption); 
      case PERIOD_OPTIONS.YEARS:
        return getBarDataForYears(countPerMonths, dateInPeriod, activeTimeFormatOption); 
      default:
        return getBarDataForWeek(data, new Date(), activeTimeFormatOption); 
    }
  
  }

export { getBarGraphData, calculateCountPerMonth_Activity };