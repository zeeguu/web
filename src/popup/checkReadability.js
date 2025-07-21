import { readableDR } from "./Pages/dr";
import { getHTMLContent } from "../JSInjection/Cleaning/pageSpecificClean";
import { drRegex } from "../JSInjection/Cleaning/Pages/dr";
import { lefigaroRegex } from "../JSInjection/Cleaning/Pages/lefigaro";
import { readableLefigaro } from "./Pages/lefigaro";
import { berlingskeRegex } from "../JSInjection/Cleaning/Pages/berlingske";
import { readableBerlingske } from "./Pages/berlingske";
import { lemondeRegex } from "../JSInjection/Cleaning/Pages/lemonde";
import { liveArticleLemonde } from "./Pages/lemonde";
import { paywallPolitiken } from "./Pages/politiken";
import { politikenRegex } from "../JSInjection/Cleaning/Pages/politiken";

export function checkReadability(url){
    if(url.match(drRegex)){
      return readableDR(getHTMLContent(url))
    }
    if(url.match(lefigaroRegex)){
      return readableLefigaro(getHTMLContent(url))
    }
    if(url.match(berlingskeRegex)){
      return readableBerlingske(getHTMLContent(url))
    } 
    if (url.match(lefigaroRegex)) {
        return readableLefigaro(getHTMLContent(url))
    } 
    if (url.match(lemondeRegex)) {
      return liveArticleLemonde(getHTMLContent(url))
    }
    if (url.match(politikenRegex)) {
      return paywallPolitiken(getHTMLContent(url))
    }
    else{
      return true;
    }
  }