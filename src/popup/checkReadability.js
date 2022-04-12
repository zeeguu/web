import { readableDR } from "./Pages/dr";
import { getEntireHTML } from "../JSInjection/Cleaning/pageSpecificClean";
import { drRegex } from "../JSInjection/Cleaning/Pages/dr";
import { lefigaroRegex } from "../JSInjection/Cleaning/Pages/lefigaro";
import { readableLefigaro } from "./Pages/lefigaro";
import { berlingskeRegex } from "../JSInjection/Cleaning/Pages/berlingske";
import { readableBerlingske } from "./Pages/berlingske";
import { lemondeRegex } from "../JSInjection/Cleaning/Pages/lemonde";
import { liveArticleLemonde } from "./Pages/lemonde";

export function checkReadability(url){
    if(url.match(drRegex)){
      return readableDR(getEntireHTML(url))
    }
    if(url.match(lefigaroRegex)){
      return readableLefigaro(getEntireHTML(url))
    }
    if(url.match(berlingskeRegex)){
      return readableBerlingske(getEntireHTML(url))
    } 
    if (url.match(lefigaroRegex)) {
        return readableLefigaro(getEntireHTML(url))
    } 
    if (url.match(lemondeRegex)) {
      return liveArticleLemonde(getEntireHTML(url))
    }
    else{
      return true;
    }
  }