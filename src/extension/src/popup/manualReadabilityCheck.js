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

function isNewsHomepage(url) {
  // List of news domains that should be blocked at homepage level
  const newsDomains = [
    'hotnews.ro',
    'bbc.co.uk',
    'bbc.com',
    'cnn.com',
    'theguardian.com',
    'nytimes.com',
    'washingtonpost.com',
    'reuters.com',
    'bloomberg.com',
    'ft.com',
    'wsj.com',
    'economist.com',
    'foxnews.com',
    'nbcnews.com',
    'usatoday.com',
    'npr.org',
    'apnews.com'
  ];
  
  // Create regex that matches homepage URLs (with or without www, with optional trailing slash)
  const homepagePattern = new RegExp(
    `^https?:\\/\\/(www\\.)?(${newsDomains.join('|').replace(/\./g, '\\.')})\\/?$`
  );
  
  if (url.match(homepagePattern)) {
    console.log(`News homepage detected (${url}) - not readable`);
    return true;
  }
  
  return false;
}

export function manualReadabilityCheck(url) {
  // Check if it's a news homepage
  if (isNewsHomepage(url)) {
    return false;
  }
  
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
