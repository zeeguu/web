import { getYear, getMonth } from 'date-fns';

function calculatePerMonth(mapData){

    var result = new Map();
  
    for (const [key, value] of mapData.entries()) {
  
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

  export { calculatePerMonth };