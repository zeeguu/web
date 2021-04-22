import { subDays, format, getYear, getMonth, eachDayOfInterval, subMonths, subYears } from 'date-fns';
import { PERIOD_OPTIONS, DATE_FORMAT } from "./ConstantsUserDashboard";
import { calculatePerMonth } from "./CommonDataFormat";

/**
 * 
 * Function that transforms an array of pairs to 
 * a map of type key->value
 * 
 * To be used for TranslatedWordsGraph
 * 
 * @param {Array} data 
 *  
 * Array containing pairs of dates and second counts
 * as received from the API for the number of translated words for user
 * 
 * [{date:dateString1, count: secondsCount1}, {date:dateString2, count: secondsCount2}, {date:dateString3, count: secondsCount3}, …]
 * 
 * example:
 * (451)[{…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
 * 
 * example entries:
 * 0:{date: '2018-03-02', count: 1223}
 * 1:{date: '2018-03-03', count: 2534}
 * 2:{date: '2018-03-05', count: 5498}
 * 
 * @returns {Map}
 * 
 * Returns a map with the date values as key and seconds count as value 
 * Map() {date1 => count1, date2 => count2, date3 => count3, …}
 * 
 * example:
 * Map(451) {2018-03-02 => 1223, 2018-03-03 => 2534, 2018-03-05 => 5498, 2018-03-06 => 5991, 2018-03-07 => 2935, …}
 */
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

    var currentWeek = getDataForInterval(data, datesCurrentWeek.start, datesCurrentWeek.end, STRING_FORMAT);

    return [
        {id: "Word Count Current Week", data: currentWeek} 
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

 
  //last 12 months (13, including the current month)
  //the bar graph also shows 13 months in total
  function getLineDataForYear(dataPerMonths, dateInYear){

    var result = [];

    const NUMBER_OF_MONTHS = 13;

    const STRING_FORMAT = "MMM-yy"; 

    var monthCounter = 0;

    while(true){

        if (monthCounter >= NUMBER_OF_MONTHS){ 
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

          //Push the first non existing year with 0 count before breaking
          //Otherwise, the lowest year will look like having "0" count
          //on the line graph

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

/**
 * 
 * Function to calculate cumulative count per months for available years
 * for number of translated words for user 
 * 
 * This calculation is done only once, together with receiving the data from the API
 * and then saved in the state in UserDashboard.js
 * 
 * @param {Map} data 
 * 
 * Map containing the number of translated words per available dates from the API
 * 
 * example:
 * Map(17) {2021-04-17 => 5, 2021-04-13 => 12, 2021-04-12 => 2, 2021-04-06 => 3, 2021-03-11 => 1, …}
 * 
 * @returns {Map}
 * 
 * Returns a Map containing the available years as key and values as new Maps, 
 * which contain counts per months.
 * This result is calculated by calling the function _calculatePerMonth_
 * from CommonDataFormat.js
 * 
 * example: 
 * Map(2) {2021 => Map(2) {…}, 2020 => Map(2) {…}}
 * 
 * example of entries from one of the inner Maps representing months count:
 * 0:{3 => 22}
 * 1:{2 => 37}
 * 
 */
 function calculateCountPerMonth_Words(data){

  return calculatePerMonth(data);

}

/**
 * Function to return the Array data for the TranslatedWordsGraph
 * depending on the different options selected from 
 * the dropdowns in UserDashboard
 * 
 * @param {Map} data 
 * 
 * Map containing data for the number of translated words
 * 
 * example:
 * Map(17) {2021-04-17 => 5, 2021-04-13 => 12, 2021-04-12 => 2, 2021-04-06 => 3, 2021-03-11 => 1, …}
 * 
 * @param {Map} countPerMonths 
 * 
 * Map representing the cumuliative count per months for the available years
 * for the number of translated words
 * 
 * example: 
 * Map(2) {2021 => Map(2) {…}, 2020 => Map(2) {…}}
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
 * @returns {Object}
 * 
 * Returns an object with id and data fields to be given to the Nivo graph
 * 
 * example:
 * {id: 'Word Count Current Week', data: Array(7)}
 * 
 */
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

  export { getLineGraphData, calculateCountPerMonth_Words, getMapData };