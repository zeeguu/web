import { getYear, getMonth } from "date-fns";

/**
 * Method to calculate cumulative count per months for available years
 *
 * The result is used to show both data for years and month in the graphs
 *
 * @param {Map} mapData
 *
 * mapData of type Map object of form
 * Map() {date1 => value1, date2 => value2, date3 => value3, …}
 *
 * example:
 * Map(17) {2021-04-17 => 5, 2021-04-13 => 12, 2021-04-12 => 2, 2021-04-06 => 3, 2021-03-11 => 1, …}
 *
 * @returns {Map}
 *
 * Returned result of type Map object of form
 * Map() {year1 => Map() {…}, year2 => Map() {…}}
 *
 * Each entry in the Map contains a year as a key
 * and a new Map with pairs of type (key:month, value:cumulative count for month)
 *
 * example:
 * Map(2) {2021 => Map(2) {…}, 2020 => Map(2) {…}}
 *
 * example of first entry:
 * key:2021
 * value:Map(2) {3 => 22, 2 => 37}
 *
 */

function calculatePerMonth(mapData) {
  var result = new Map();

  for (const [key, value] of mapData.entries()) {
    var date = new Date(key);

    var year = getYear(date);

    //in date-fns, as in JavaScript standard library 0 means January, 6 is July and 11 is December (getMonth)
    var month = getMonth(date);

    if (result.has(year)) {
      if (result.get(year).has(month)) {
        var prev = result.get(year).get(month);
        result.get(year).set(month, prev + value);
      } else {
        result.get(year).set(month, value);
      }
    } else {
      var mapMonth = new Map();
      mapMonth.set(month, value);
      result.set(year, mapMonth);
    }
  }

  return result;
}

export { calculatePerMonth };
