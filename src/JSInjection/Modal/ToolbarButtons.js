import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc"
import strings from "../../zeeguu-react/src/i18n/definitions"
import {toggle} from "../../zeeguu-react/src/reader/ArticleReader"

export default function ToolbarButtons({translating, setTranslating, pronouncing, setPronouncing}) {
  return (
    <s.Toolbar style={{ display: "flex", "justify-content": "flex-end", height: "94px"}}>
      <button
        className={translating ? "selected" : ""}
        onClick={(e) => toggle(translating, setTranslating)}
      >
        <img
          src={chrome.runtime.getURL("images/translate.svg")}
          alt={strings.translateOnClick}
        />
        <span className="tooltiptext">{strings.translateOnClick}</span>
      </button>
      <button
        className={pronouncing ? "selected" : ""}
        onClick={(e) => toggle(pronouncing, setPronouncing)}
      >
        <img
          src={chrome.runtime.getURL("images/sound.svg")}
          alt={strings.listenOnClick}
        />
        <span className="tooltiptext">{strings.listenOnClick}</span>
      </button>
    </s.Toolbar>
  );
}
