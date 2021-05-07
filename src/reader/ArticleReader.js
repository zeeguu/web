import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as s from "./ArticleReader.sc";
import { Link } from "react-router-dom";

import { TranslatableText } from "./TranslatableText";

import InteractiveText from "./InteractiveText";
import BookmarkButton from "./BookmarkButton";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { PopupButtonWrapper, StyledButton } from "../teacher/TeacherButtons.sc";
import * as c from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";


let FREQUENCY_KEEPALIVE = 30 * 1000; // 30 seconds
let previous_time = 0; // since sent a scroll update

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ArticleReader({ api, teacherArticleID }) {
  let articleID = "";
  let query = useQuery();
  teacherArticleID
    ? (articleID = teacherArticleID)
    : (articleID = query.get("id"));
  console.log(articleID)

  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();

  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);

  useEffect(() => {
    api.getArticleInfo(articleID, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(articleInfo.content, articleInfo, api)
      );
      setInteractiveTitle(
        new InteractiveText(articleInfo.title, articleInfo, api)
      );
      setArticleInfo(articleInfo);
      setTitle(articleInfo.title);

      api.setArticleOpened(articleInfo.id);
      api.logUserActivity(api.OPEN_ARTICLE, articleID);
    });

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document
      .getElementById("scrollHolder")
      .addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document
        .getElementById("scrollHolder")
        .removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line
  }, []);

  function onScroll() {
    let _current_time = new Date();
    let current_time = _current_time.getTime();

    if (previous_time == 0) {
      api.logUserActivity(api.SCROLL, articleID);
      previous_time = current_time;
    } else {
      if (current_time - previous_time > FREQUENCY_KEEPALIVE) {
        api.logUserActivity(api.SCROLL, articleID);
        previous_time = current_time;
      } else {
      }
    }
  }

  function onFocus() {
    api.logUserActivity(api.ARTICLE_FOCUSED, articleID);
  }
  function onBlur() {
    api.logUserActivity(api.ARTICLE_UNFOCUSED, articleID);
  }

  function toggle(state, togglerFunction) {
    togglerFunction(!state);
  }

  function toggleBookmarkedState() {
    let newArticleInfo = { ...articleInfo, starred: !articleInfo.starred };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logUserActivity(api.STAR_ARTICLE, articleID);
  }

  function setLikedState(state) {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logUserActivity(api.LIKE_ARTICLE, articleID, state);
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  return (

    <s.ArticleReader>

      <PopupButtonWrapper>

        <Link to={`/teacher/texts/editText/${articleID}`}>
          <StyledButton secondary studentView>STRINGBack to editing</StyledButton>
        </Link>
        <StyledButton primary studentView>STRINGAdd to class</StyledButton>{" "}

        <s.Toolbar>

          <button
            className={translating ? "selected" : ""}
            onClick={(e) => toggle(translating, setTranslating)}
          >
            <img
              src="/static/images/translate.svg"
              alt={strings.translateOnClick}
            />
            <span className="tooltiptext">{strings.translateOnClick}</span>
          </button>
          <button
            className={pronouncing ? "selected" : ""}
            onClick={(e) => toggle(pronouncing, setPronouncing)}
          >
            <img src="/static/images/sound.svg" alt={strings.listenOnClick} />
            <span className="tooltiptext">{strings.listenOnClick}</span>
          </button>

        </s.Toolbar>
      </PopupButtonWrapper>

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
        {strings.source}
      </a>
      <hr />
      <s.MainText>
        <TranslatableText
          interactiveText={interactiveText}
          translating={translating}
          pronouncing={pronouncing}
        />
      </s.MainText>

      <s.FeedbackBox>
        <small>{strings.helpUsMsg}</small>

        <h4>{strings.didYouEnjoyMsg}</h4>

        <s.CenteredContent>
          <s.WhiteButton
            onClick={(e) => setLikedState(true)}
            className={articleInfo.liked === true && "selected"}
          >
            {strings.yes}
          </s.WhiteButton>
          <s.WhiteButton
            onClick={(e) => setLikedState(false)}
            className={articleInfo.liked === false && "selected"}
          >
            {strings.no}
          </s.WhiteButton>
        </s.CenteredContent>
      </s.FeedbackBox>

      <s.FeedbackBox>
        <h2>{strings.reviewVocabulary}</h2>
        <small>{strings.reviewVocabExplanation}</small>
        <br />
        <br />
        <s.CenteredContent>
          <Link to={`/words/forArticle/${articleID}`}>
            <s.OrangeButton>{strings.reviewVocabulary}</s.OrangeButton>
          </Link>
        </s.CenteredContent>
      </s.FeedbackBox>
      <s.ExtraSpaceAtTheBottom />
    </s.ArticleReader>
  );
}