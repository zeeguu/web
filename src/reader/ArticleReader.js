import { useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { RoutingContext } from "../contexts/RoutingContext";
import { TranslatableText } from "./TranslatableText";
import InteractiveText from "./InteractiveText";
import BookmarkButton from "./BookmarkButton";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import {
  PopupButtonWrapper,
  StyledButton,
} from "../teacher/styledComponents/TeacherButtons.sc";
import * as s from "./ArticleReader.sc";

let FREQUENCY_KEEPALIVE = 30 * 1000; // 30 seconds
let previous_time = 0; // since sent a scroll update

export const UMR_SOURCE = "UMR";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function onScroll(api, articleID, source) {
  let _current_time = new Date();
  let current_time = _current_time.getTime();
  if (previous_time === 0) {
    api.logReaderActivity(api.SCROLL, articleID, "", source);
    previous_time = current_time;
  } else {
    if (current_time - previous_time > FREQUENCY_KEEPALIVE) {
      api.logReaderActivity(api.SCROLL, articleID, "", source);
      previous_time = current_time;
    } else {
    }
  }
}

export function onFocus(api, articleID, source) {
  api.logReaderActivity(api.ARTICLE_FOCUSED, articleID, "", source);
}

export function onBlur(api, articleID, source) {
  api.logReaderActivity(api.ARTICLE_UNFOCUSED, articleID, "", source);
}

export function toggle(state, togglerFunction) {
  togglerFunction(!state);
}

export default function ArticleReader({ api, teacherArticleID }) {
  let articleID = "";
  let query = useQuery();
  teacherArticleID
    ? (articleID = teacherArticleID)
    : (articleID = query.get("id"));
  const { setReturnPath } = useContext(RoutingContext); //This to be able to use Cancel correctly in EditText.

  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);
  const user = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    api.getArticleInfo(articleID, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(articleInfo.content, articleInfo, api, UMR_SOURCE)
      );
      setInteractiveTitle(
        new InteractiveText(articleInfo.title, articleInfo, api, UMR_SOURCE)
      );
      setArticleInfo(articleInfo);
      setTitle(articleInfo.title);

      api.setArticleOpened(articleInfo.id);
      api.logReaderActivity(api.OPEN_ARTICLE, articleID, "", UMR_SOURCE);
    });

    window.addEventListener("focus", function () {
      onFocus(api, articleID, UMR_SOURCE);
    });
    window.addEventListener("blur", function () {
      onBlur(api, articleID, UMR_SOURCE);
    });
    document
      .getElementById("scrollHolder")
      .addEventListener("scroll", function () {
        onScroll(api, articleID, UMR_SOURCE);
      });

    return () => {
      window.removeEventListener("focus", function () {
        onFocus(api, articleID, UMR_SOURCE);
      });
      window.removeEventListener("blur", function () {
        onBlur(api, articleID, UMR_SOURCE);
      });

      document.getElementById("scrollHolder") !== null &&
        document
          .getElementById("scrollHolder")
          .removeEventListener("scroll", function () {
            onScroll(api, articleID, UMR_SOURCE);
          });
      api.logReaderActivity("ARTICLE CLOSED", articleID, "", UMR_SOURCE);
    };
    // eslint-disable-next-line
  }, []);

  function toggleBookmarkedState() {
    let newArticleInfo = { ...articleInfo, starred: !articleInfo.starred };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(api.STAR_ARTICLE, articleID, "", UMR_SOURCE);
  }

  function setLikedState(state) {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(api.LIKE_ARTICLE, articleID, state, UMR_SOURCE);
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  const saveArticleToOwnTexts = () => {
    api.getArticleInfo(articleID, (article) => {
      api.uploadOwnText(
        article.title,
        article.content,
        article.language,
        (newID) => {
          history.push(`/teacher/texts/editText/${newID}`);
        }
      );
    });
  };

  const handleSaveCopyToShare = () => {
    setReturnPath("/teacher/texts/AddTextOptions");
    saveArticleToOwnTexts();
  };

  function reportBroken(e) {
    let answer = prompt("What is wrong with the article?");
    if (answer) {
      let feedback = "broken_" + answer.replace(/ /g, "_");
      api.logReaderActivity(api.USER_FEEDBACK, articleID, feedback, UMR_SOURCE);
      setTimeout(() => history.push("/articles"), 500);
    }
  }

  return (
    <s.ArticleReader>
      <PopupButtonWrapper>
        {user.is_teacher && (
          <div>
            {teacherArticleID && (
              <Link to={`/teacher/texts/editText/${articleID}`}>
                <StyledButton secondary studentView>
                  {strings.backToEditing}
                </StyledButton>
              </Link>
            )}

            {!teacherArticleID && (
              <StyledButton primary studentView onClick={handleSaveCopyToShare}>
                {strings.saveCopyToShare}
              </StyledButton>
            )}
          </div>
        )}

        <s.Toolbar>
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
      </PopupButtonWrapper>
      <s.WhiteButton small gray onClick={reportBroken}>
        {strings.reportBrokenArticle}
      </s.WhiteButton>

      <br />

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

      <br />

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
          <s.NavigationLink primary to={`/words/forArticle/${articleID}`}>
            {strings.reviewVocabulary}
          </s.NavigationLink>
        </s.CenteredContent>
      </s.FeedbackBox>
      <s.ExtraSpaceAtTheBottom />
    </s.ArticleReader>
  );
}
