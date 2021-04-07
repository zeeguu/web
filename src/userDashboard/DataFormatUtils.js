import { isBefore, subDays, addDays, isSameDay, format, getYear, getMonth, eachDayOfInterval, subMonths, subYears } from 'date-fns';

const PERIOD_OPTIONS = {
    WEEK: "Week",
    MONTH: "Month",
    YEAR: "Year",
    YEARS: 'Years'
  };

const DATE_FORMAT = "yyyy-MM-dd";

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

  function calculateCountPerMonth(data){

    var result = new Map();

    for (const [key, value] of data.entries()) {

        var date = new Date(key);

        var year = getYear(date);
        //in date-fns, as in JavaScript standard library 0 means January, 6 is July and 11 is December (getMonth)
        var month = getMonth(date);

        if (result.has(year)){

            if (result.get(year).has(month)){

                var prev = result.get(year).get(month);
                result.get(year).set(month, prev + value);

            }

            else{

              result.get(year).set(month, value);

            }

        } 
        
        else{

          var mapMonth = new Map();
          mapMonth.set(month, value);
          result.set(year, mapMonth);

        }

      }

    return result;

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

          console.log(sum);

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

  export { getLineGraphData, getFormattedWordCountData, calculateCountPerMonth, PERIOD_OPTIONS};