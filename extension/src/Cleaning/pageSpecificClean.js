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
import { drRegex, cleanDRBefore, saveElements, addElements } from "./Pages/dr";
import {
  cleanLexpress,
  lexpressRegex,
  cleanLexpressBefore,
} from "./Pages/lexpress";
import {
  marianneRegex,
  cleanMarianne,
  cleanMarianneBefore,
} from "./Pages/marianne";
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
import {
  politikenRegex,
  cleanPolitiken,
  cleanPolitikenBefore,
} from "./Pages/politiken";
import { scientiasRegex, cleanScientias } from "./Pages/scientias";
import { egyszervoltRegex, cleanEgyszervolt } from "./Pages/egyszervolt";
import { corriereRegex, removeCorriereScripts } from "./Pages/corriere";

export function getHTMLContent(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

export function individualClean(content, url, cleaningArray) {
  for (let i = 0; i < cleaningArray.length; i++) {
    const regx = cleaningArray[i].regex;
    const cleaningFunction = cleaningArray[i].function;
    if (url.match(regx)) {
      return cleaningFunction(content, url);
    }
  }
  return content;
}

//Arrays with url regex and associated cleaning function, that has to be applied to
//the page

export const cleanBeforeArray = [
  { regex: drRegex, function: cleanDRBefore },
  { regex: lemondeRegex, function: cleanLemondeBefore },
  { regex: nuRegex, function: cleanNuBefore },
  { regex: ekstrabladetRegex, function: cleanEkstraBladetBefore },
  { regex: leqiupeRegex, function: cleanLequipeBefore },
  { regex: berlingskeRegex, function: cleanBerlingskeBefore },
  { regex: spiegelRegex, function: cleanSpiegelBefore },
  { regex: expressRegex, function: cleanExpressBefore },
  { regex: faktRegex, function: cleanFaktBefore },
  { regex: rzeczRegex, function: cleanRzeczBefore },
  { regex: lexpressRegex, function: cleanLexpressBefore },
  { regex: marianneRegex, function: cleanMarianneBefore },
  { regex: politikenRegex, function: cleanPolitikenBefore },
];

export const cleanAfterArray = [
  { regex: wikiRegex, function: cleanWiki },
  { regex: btRegex, function: cleanBT },
  { regex: ekstrabladetRegex, function: cleanEkstraBladet },
  { regex: lemondeRegex, function: cleanLemonde },
  { regex: lexpressRegex, function: cleanLexpress },
  { regex: marianneRegex, function: cleanMarianne },
  { regex: ingenioerRegex, function: cleanIngenioeren },
  { regex: berlingskeRegex, function: cleanBerlingske },
  { regex: bbcRegex, function: cleanBBC },
  { regex: wyborczaRegex, function: cleanWyborcza },
  { regex: rzeczRegex, function: cleanRzecz },
  { regex: politikenRegex, function: cleanPolitiken },
  { regex: scientiasRegex, function: cleanScientias },
  { regex: egyszervoltRegex, function: cleanEgyszervolt },
];

export function cleanDOMAfter(url) {
  if (url.match(drRegex)) {
    const elements = saveElements();
    addElements(elements);
  }

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
