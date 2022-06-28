import { btRegex, cleanBT } from "./Pages/bt";
import { wikiRegex, cleanWiki } from "./Pages/wiki";
import {
  ekstrabladetRegex,
  cleanEkstraBladet,
  cleanEkstraBladetBefore,
} from "./Pages/ekstrabladet";
import {
  lemondeRegex,
  cleanLemondeBefore,
  cleanLemonde,
} from "./Pages/lemonde";
import { drRegex, cleanDRBefore } from "./Pages/dr";
import { cleanLexpress, lexpressRegex, cleanLexpressBefore} from "./Pages/lexpress";
import { marianneRegex, cleanMarianne, cleanMarianneBefore } from "./Pages/marianne";
import { cleanIngenioeren, ingenioerRegex } from "./Pages/ingenioeren";
import { nuRegex, cleanNuBefore } from "./Pages/nu";
import { leqiupeRegex, cleanLequipeBefore } from "./Pages/lequipe";
import {
  berlingskeRegex,
  cleanBerlingske,
  cleanBerlingskeBefore,
} from "./Pages/berlingske";
import { spiegelRegex, cleanSpiegelBefore } from "./Pages/spiegel";
import { bbcRegex, cleanBBC } from "./Pages/bbc";
import { cleanExpressBefore, expressRegex } from "./Pages/express";
import { cleanWyborcza, wyborczaRegex } from "./Pages/wyborcza";
import { cleanRzecz, cleanRzeczBefore, rzeczRegex } from "./Pages/rzecz";
import { cleanFaktBefore, faktRegex, removeFaktIFrames } from "./Pages/fakt";
import { deleteIntervals, deleteTimeouts } from "../../popup/functions";
import { politikenRegex, cleanPolitiken } from "./Pages/politiken";
import { scientiasRegex, cleanScientias } from "./Pages/scientias";
import { egyszervoltRegex, cleanEgyszervolt } from "./Pages/egyszervolt";
import { corriereRegex, removeCorriereScripts } from "./Pages/corriere";

export function getHTMLContent(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

export function pageSpecificClean(readabilityContent, url) {
  if (url.match(wikiRegex)) {
    return cleanWiki(readabilityContent);
  }
  if (url.match(btRegex)) {
    return cleanBT(readabilityContent);
  }
  if (url.match(ekstrabladetRegex)) {
    return cleanEkstraBladet(getHTMLContent(url), readabilityContent);
  }
  if (url.match(lemondeRegex)) {
    return cleanLemonde(readabilityContent);
  }
  if (url.match(lexpressRegex)) {
    return cleanLexpress(readabilityContent);
  }
  if (url.match(marianneRegex)) {
    return cleanMarianne(readabilityContent);
  }
  if (url.match(ingenioerRegex)) {
    return cleanIngenioeren(getHTMLContent(url), readabilityContent);
  }
  if (url.match(berlingskeRegex)) {
    return cleanBerlingske(readabilityContent);
  }
  if (url.match(bbcRegex)) {
    return cleanBBC(readabilityContent);
  }
  if (url.match(wyborczaRegex)) {
    return cleanWyborcza(readabilityContent);
  }
  if (url.match(rzeczRegex)) {
    return cleanRzecz(readabilityContent);
  }
  if (url.match(politikenRegex)) {
    return cleanPolitiken(readabilityContent);
  }
  if (url.match(scientiasRegex)) {
    return cleanScientias(readabilityContent);
  }
  if (url.match(egyszervoltRegex)) {
    return cleanEgyszervolt(readabilityContent);
  }
  return readabilityContent;
}

export function cleanDocumentClone(documentClone, url) {
  if (url.match(drRegex)) {
    return cleanDRBefore(documentClone);
  }
  if (url.match(lemondeRegex)) {
    return cleanLemondeBefore(documentClone);
  }
  if (url.match(nuRegex)) {
    return cleanNuBefore(documentClone);
  }
  if (url.match(ekstrabladetRegex)) {
    return cleanEkstraBladetBefore(documentClone);
  }
  if (url.match(leqiupeRegex)) {
    return cleanLequipeBefore(documentClone);
  }
  if (url.match(berlingskeRegex)) {
    return cleanBerlingskeBefore(documentClone);
  }
  if (url.match(spiegelRegex)) {
    return cleanSpiegelBefore(documentClone);
  }
  if (url.match(expressRegex)) {
    return cleanExpressBefore(documentClone);
  }
  if (url.match(faktRegex)) {
    return cleanFaktBefore(documentClone);
  }
  if (url.match(rzeczRegex)) {
    return cleanRzeczBefore(documentClone);
  }
  if (url.match(lexpressRegex)) {
    return cleanLexpressBefore(documentClone);
  }
  if (url.match(marianneRegex)) {
    return cleanMarianneBefore(documentClone);
  }

  return documentClone;
}

export function cleanDOMAfter(url) {
  deleteIntervals();
  deleteTimeouts();

  if (url.match(faktRegex)) {
    setTimeout(function () {
      removeFaktIFrames();
    }, 10000);
  }
  if (url.match(corriereRegex)) {
    setTimeout(function () {
      removeCorriereScripts();
    }, 10000);
  }
}
