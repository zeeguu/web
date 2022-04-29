import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc"
import strings from "../../zeeguu-react/src/i18n/definitions"
import {toggle} from "../../zeeguu-react/src/reader/ArticleReader"

export default function ToolbarButtons({translating, setTranslating, pronouncing, setPronouncing}) {
  return (
    <s.Toolbar style={{ "float": "right"}}>
      <button
        className={translating ? "selected" : ""}
        onClick={(e) => toggle(translating, setTranslating)}
      >
        <img
          src="https://zeeguu.org/static/images/translate.svg"
          alt={strings.translateOnClick}
        />
        <div className="tooltiptext">{strings.translateOnClick}</div>
      </button>
      <button
        className={pronouncing ? "selected" : ""}
        onClick={(e) => toggle(pronouncing, setPronouncing)}
      >
        <img
          src="https://zeeguu.org/static/images/sound.svg"
          alt={strings.listenOnClick}
        />
        <div className="tooltiptext">{strings.listenOnClick}</div>
      </button>
    </s.Toolbar>
  );
}
