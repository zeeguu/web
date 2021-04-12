import { isBefore, subDays, addDays, isSameDay, format, getYear, getMonth, eachDayOfInterval, subMonths, subYears } from 'date-fns';
import {PERIOD_OPTIONS, DATE_FORMAT} from "./ConstantsUserDashboard";
import {calculatePerMonth} from "./DataFormat";

function getMapData(data){

  var result = new Map();
  
  data.forEach(
    (row) => {
      result.set(row.date, row.count);
    }
  );

  return result;

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
  
  // last 30 days from given date
  function getLineDataForMonth(data, dateInMonth){

    const STRING_FORMAT = "dd-MM"; 

    var datesCurrentMonth = {
        start: subDays(dateInMonth, 30),
        end: dateInMonth
    };

    var currentMonth = getDataForInterval(data, datesCurrentMonth.start, datesCurrentMonth.end, STRING_FORMAT);

    return [
        {id: "Word Count Last 30 Days", data: currentMonth}   
    ];

  }

  function calculateCountPerMonth_Words(data){

    return calculatePerMonth(data);

  }
  
  function getLineDataForYear(dataPerMonths, dateInYear){

    var result = [];

    const STRING_FORMAT = "MMM-yy"; 

    var monthCounter = 0;

    while(true){

        if (monthCounter >= 12){ //TODO: make this a constant somewhere or change the number
            break;
        }

        var year = getYear(dateInYear);

        var month = getMonth(dateInYear);

        if (dataPerMonths.has(year)){

            if(dataPerMonths.get(year).has(month)){
    
                result.push(
                    {
                    x: format(dateInYear, STRING_FORMAT), 
                    y: dataPerMonths.get(year).get(month)
                }
                );
    
            }
    
            else{
    
                result.push(
                    {
                    x: format(dateInYear, STRING_FORMAT), 
                    y: 0
                }
                );
    
            }
        }

        else{

          result.push(
            {
            x: format(dateInYear, STRING_FORMAT), 
            y: 0
        }
        );

        }

        monthCounter++;
        dateInYear = subMonths(dateInYear, 1);
    
    }

    return [
        {id: "Word Count Last Year", data: result.reverse()}   
    ];

  }
  
  function getLineDataForYears(dataPerMonths, dateInYear){

    var result = [];

    const STRING_FORMAT = "yyyy"; 

    while(true){

        var year = getYear(dateInYear);

        if (!dataPerMonths.has(year)){

          result.push(
              {
              x: format(dateInYear, STRING_FORMAT), 
              y: 0
            }
          );

          break;

        }

        else{

          var sum = 0;

          for (const [ , value] of dataPerMonths.get(year).entries()) {
            sum += value;
          }

          result.push(
            {
            x: format(dateInYear, STRING_FORMAT), 
            y: sum
        }
        );

      }

      dateInYear = subYears(dateInYear, 1);

    }

    return [
        {id: "Word Count Available Years", data: result.reverse()}   
    ];

  }
  
  function getLineGraphData(data, countPerMonths, period, dateInPeriod){
    
    switch(period) {
      case PERIOD_OPTIONS.WEEK:
        return getLineDataForWeek(data, dateInPeriod); 
      case PERIOD_OPTIONS.MONTH:
        return getLineDataForMonth(data, dateInPeriod); 
      case PERIOD_OPTIONS.YEAR:
        return getLineDataForYear(countPerMonths, dateInPeriod); 
      case PERIOD_OPTIONS.YEARS:
        return getLineDataForYears(countPerMonths, dateInPeriod); 
      default:
        return getLineDataForWeek(data, new Date()); 
    }
  
  }

  export { getLineGraphData, calculateCountPerMonth_Words, getMapData};