import { isBefore, subDays, addDays, isSameDay, format, getYear, getMonth, eachDayOfInterval, subMonths, subYears } from 'date-fns';
import {PERIOD_OPTIONS, DATE_FORMAT, BAR_GRAPH_KEYS} from "./ConstantsUserDashboard";

function getDataForInterval(data, startDate, endDate, dateFormatString){

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
                            
    result.push({ date: stringlegend, reading_time: readingCount, exercises_time: exercisesCount});

  });

  return result; 

}


function getBarDataForWeek(data, dateInWeek){

  const STRING_FORMAT = "dd-MM"; 

  var datesCurrentWeek = {
      start: subDays(dateInWeek, 6),
      end: dateInWeek
  };

  var result =  getDataForInterval(data, datesCurrentWeek.start, datesCurrentWeek.end, STRING_FORMAT);
  return result;
}

function getBarDataForMonth(data, dateInMonth){

  const STRING_FORMAT = "dd-MM"; 

  var datesCurrentMonth = {
      start: subDays(dateInMonth, 30),
      end: dateInMonth
  };

  return getDataForInterval(data, datesCurrentMonth.start, datesCurrentMonth.end, STRING_FORMAT);

}

function getBarDataForYear(){

}

function getBarDataForYears(){
    
}

function getBarGraphData(data, countPerMonths, period, dateInPeriod){
    
    switch(period) {
      case PERIOD_OPTIONS.WEEK:
        return getBarDataForWeek(data, dateInPeriod); 
      case PERIOD_OPTIONS.MONTH:
        return getBarDataForMonth(data, dateInPeriod); 
      case PERIOD_OPTIONS.YEAR:
        return getBarDataForYear(countPerMonths, dateInPeriod); 
      case PERIOD_OPTIONS.YEARS:
        return getBarDataForYears(countPerMonths, dateInPeriod); 
      default:
        return getBarDataForWeek(data, new Date()); 
    }
  
  }

export {getBarGraphData};