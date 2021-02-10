import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./article.css";
import * as s from "./ArticleReader.sc";

import { TranslatableText } from "./TranslatableText";

import InteractiveText from "./InteractiveText";
import BookmarkButton from "./BookmarkButton";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ArticleReader({ api }) {
  let query = useQuery();

  const articleID = query.get("id");

  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();

  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);

  const [undoCount, setUndoCount] = useState(0);

  useEffect(() => {
    api.getArticleInfo(articleID, (data) => {
      console.log(data);
      setInteractiveText(new InteractiveText(data.content, data, api));
      setInteractiveTitle(new InteractiveText(data.title, data, api));
      setArticleInfo(data);
    });
  }, []);

  function toggle(state, togglerFunction) {
    togglerFunction(!state);
  }

  function toggleBookmarkedState() {
    let newArticleInfo = { ...articleInfo, starred: !articleInfo.starred };
    console.log("updated article info");
    console.log(newArticleInfo);
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
      console.log("updating state...");
    });
  }

  if (!articleInfo) {
    return <div>'...'</div>;
  }
  console.log(articleInfo);
  return (
    <s.ArticleReader>
      <s.Toolbar>
        <div className="lala">
          <button
            className={translating ? "selected" : ""}
            onClick={(e) => toggle(translating, setTranslating)}
          >
            <img src="/static/images/translate.svg" alt="translate on click" />
            <span className="tooltiptext">translate on click</span>
          </button>
          <button
            className={pronouncing ? "selected" : ""}
            onClick={(e) => toggle(pronouncing, setPronouncing)}
          >
            <img src="/static/images/sound.svg" alt="listen on click" />
            <span className="tooltiptext">listen on click</span>
          </button>
          <button
            className="tool"
            onClick={(e) => {
              interactiveText.undo();
              setUndoCount(undoCount + 1);
            }}
          >
            <img src="/static/images/undo.svg" alt="undo a translation" />
            <span className="tooltiptext">undo translation</span>
          </button>
        </div>
      </s.Toolbar>
      <s.Title>
        <TranslatableText
          interactiveText={interactiveTitle}
          translating={translating}
          pronouncing={pronouncing}
        />
      </s.Title>
      <s.BookmarkButton>
        <BookmarkButton
          bookmarked={articleInfo.starred}
          toggleBookmarkedState={toggleBookmarkedState}
        />
      </s.BookmarkButton>
      <br />
      <div>{articleInfo.authors}</div>
      <a href={articleInfo.url} target="_blank" rel="noreferrer" id="source">
        source
      </a>
      <hr />
      <s.MainText>
        <TranslatableText
          interactiveText={interactiveText}
          translating={translating}
          pronouncing={pronouncing}
        />
      </s.MainText>

      
    </s.ArticleReader>
  );
}
