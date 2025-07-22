import { readableDR } from "./Pages/dr";
import { getHTMLContent } from "../Cleaning/pageSpecificClean";
import { drRegex } from "../Cleaning/Pages/dr";
import { lefigaroRegex } from "../Cleaning/Pages/lefigaro";
import { readableLefigaro } from "./Pages/lefigaro";
import { berlingskeRegex } from "../Cleaning/Pages/berlingske";
import { readableBerlingske } from "./Pages/berlingske";
import { lemondeRegex } from "../Cleaning/Pages/lemonde";
import { liveArticleLemonde } from "./Pages/lemonde";
import { paywallPolitiken } from "./Pages/politiken";
import { politikenRegex } from "../Cleaning/Pages/politiken";

export function manualReadabilityCheck(url) {
  if (url.match(drRegex)) {
    return readableDR(getHTMLContent(url));
  }
  if (url.match(lefigaroRegex)) {
    return readableLefigaro(getHTMLContent(url));
  }
  if (url.match(berlingskeRegex)) {
    return readableBerlingske(getHTMLContent(url));
  }
  if (url.match(lefigaroRegex)) {
    return readableLefigaro(getHTMLContent(url));
  }
  if (url.match(lemondeRegex)) {
    return liveArticleLemonde(getHTMLContent(url));
  }
  if (url.match(politikenRegex)) {
    return paywallPolitiken(getHTMLContent(url));
  } else {
    return true;
  }
}
