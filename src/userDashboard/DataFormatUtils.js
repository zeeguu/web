import { isBefore, subDays, addDays, isSameDay, format, startOfWeek, endOfWeek, isAfter, eachDayOfInterval } from 'date-fns'

const PERIOD_OPTIONS = {
    WEEK: "Week",
    MONTH: "Month",
    YEAR: "Year",
    YEARS: 'Years'
  };

const DATE_FORMAT = "dd-MM-yyyy";

function getFormattedWordCountData(data){

    var lastDate = new Date(data[data.length-1].date);
  
    var counterDate = new Date();
  
    counterDate = addDays(counterDate, 1);
  
    var dataCounter = 0;
  
    var formattedData = new Map();
    
    // start from today and go until the last date in the data
    // add missing dates with 0 counts
    while (true){
  
      counterDate = subDays(counterDate, 1);
      var stringDate = format(counterDate, DATE_FORMAT);
  
      if ( isBefore(counterDate, lastDate) ){
        break;
      }
      
      var dataRow = data[dataCounter];
  
      var dataKey = dataRow.date;
  
      if ( isSameDay(counterDate, new Date(dataKey)) ){
        formattedData.set(stringDate, dataRow.count);
        dataCounter++;
      }
  
      else{
        formattedData.set(stringDate, 0);
      }
      
    }
  
    console.log(formattedData);
    return formattedData;

}

function getDataForInterval(data, startDate, endDate, dateFormatString){

    var result = [];
  
    var dates = eachDayOfInterval(
      { start: startDate, end: endDate}
    )
  
    dates.forEach(day => {
      var stringDate = format(day, DATE_FORMAT);
      var stringlegend = format(day, dateFormatString); 
      data.has(stringDate) ? result.push({ x: stringlegend, y: data.get(stringDate)}) : result.push({ x: stringlegend, y: 0});
    });
  
    return result; 

  }
  
function getLineDataForWeek(data, dateInWeek){

    const STRING_FORMAT = "dd-MM"; 

    var datesCurrentWeek = {
        start: subDays(dateInWeek, 6),
        end: dateInWeek
    };

    var datesPreviousWeek = {
        start: subDays(datesCurrentWeek.start, 7),
        end: subDays(datesCurrentWeek.start, 1)
    };

    var currentWeek = getDataForInterval(data, datesCurrentWeek.start, datesCurrentWeek.end, STRING_FORMAT);

    var previousWeek = getDataForInterval(data, datesPreviousWeek.start, datesPreviousWeek.end, STRING_FORMAT);

    return [
        {id: "Word Count Current Week", data: currentWeek}, 
        //  {id: "Word Count Previous Week// ", data: previousWeek}    
    ];
  
  }
  
  // last 30 days
  function getLineDataForMonth(data, dateInMonth){

    const STRING_FORMAT = "dd-MM"; 

    var datesCurrentMonth = {
        start: subDays(dateInMonth, 30),
        end: dateInMonth
    };

    var datesPreviousWeek = {
        start: subDays(datesCurrentMonth.start, 30),
        end: subDays(datesCurrentMonth.start, 1)
    };

    var currentMonth = getDataForInterval(data, datesCurrentMonth.start, datesCurrentMonth.end, STRING_FORMAT);

    return [
        {id: "Word Count Last 30 Days", data: currentMonth}   
    ];

  }
  
  function getLineDataForYear(data, dateInYear){
    
  }
  
  function getLineDataForYears(data, dateInYears){
    
  }
  
  function getLineGraphData(data, period, dateInPeriod){
  
    var periodData = [];
  
    switch(period) {
      case PERIOD_OPTIONS.WEEK:
        return getLineDataForWeek(data, dateInPeriod); 
      case PERIOD_OPTIONS.MONTH:
        return getLineDataForMonth(data, dateInPeriod); 
      case PERIOD_OPTIONS.YEAR:
        return getLineDataForYear(data, dateInPeriod); 
      case PERIOD_OPTIONS.YEARS:
        return getLineDataForYears(data, dateInPeriod); 
      default:
        return getLineDataForWeek(data, new Date()); 
    }
  
  }

  export { getLineGraphData, getFormattedWordCountData, PERIOD_OPTIONS};