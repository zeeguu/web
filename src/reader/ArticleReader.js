import { useEffect, useState, useContext, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { SpeechContext } from "../contexts/SpeechContext";
import { TranslatableText } from "./TranslatableText";
import InteractiveText from "./InteractiveText";
import { random } from "../utils/basic/arrays";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import * as s from "./ArticleReader.sc";
import DifficultyFeedbackBox from "./DifficultyFeedbackBox";
import LikeFeedBackBox from "./LikeFeedbackBox";
import { extractVideoIDFromURL } from "../utils/misc/youtube";

import ArticleSource from "./ArticleSource";
import ReportBroken from "./ReportBroken";

import TopToolbar from "./TopToolbar";
import ReviewVocabularyInfoBox from "./ReviewVocabularyInfoBox";
import ArticleAuthors from "./ArticleAuthors";
import useActivityTimer from "../hooks/useActivityTimer";
import useShadowRef from "../hooks/useShadowRef";
import useScrollTracking from "../hooks/useScrollTracking";
import strings from "../i18n/definitions";
import useUserPreferences from "../hooks/useUserPreferences";
import ArticleStatInfo from "../components/ArticleStatInfo";
import DigitalTimer from "../components/DigitalTimer";
import { APIContext } from "../contexts/APIContext";
import SimplificationLevelsNotice from "../components/SimplificationLevelsNotice";

// UMR stands for historical reasons for: Unified Multilingual Reader
export const WEB_READER = "UMR";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function onFocus(api, articleID, source) {
  api.logUserActivity(api.ARTICLE_FOCUSED, articleID, "", source);
}

export function onBlur(api, articleID, source) {
  api.logUserActivity(api.ARTICLE_UNFOCUSED, articleID, "", source);
}

export default function ArticleReader({ teacherArticleID }) {
  const api = useContext(APIContext);
  let articleID = "";
  let query = useQuery();
  teacherArticleID ? (articleID = teacherArticleID) : (articleID = query.get("id"));
  let last_reading_percentage = query.get("percentage");
  last_reading_percentage = last_reading_percentage === "undefined" ? null : Number(last_reading_percentage);

  const [articleInfo, setArticleInfo] = useState();

  const [interactiveTitle, setInteractiveTitle] = useState();
  const [interactiveFragments, setInteractiveFragments] = useState();
  const { translateInReader, pronounceInReader, updateTranslateInReader, updatePronounceInReader } =
    useUserPreferences(api);
  const [readerReady, setReaderReady] = useState();
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [clickedOnReviewVocab, setClickedOnReviewVocab] = useState(false);

  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const speech = useContext(SpeechContext);
  const [activityTimer, isTimerActive] = useActivityTimer(uploadActivity);
  const [readingSessionId, setReadingSessionId] = useState();
  const [bookmarks, setBookmarks] = useState([]);

  const clickedOnReviewVocabRef = useShadowRef(clickedOnReviewVocab);
  const readingSessionIdRef = useShadowRef(readingSessionId);

  // Getter function for InteractiveText to access current reading session ID
  const getReadingSessionId = useCallback(() => readingSessionIdRef.current, []);

  // Use the shared scroll tracking hook
  const {
    scrollPosition,
    handleScroll,
    sendFinalScrollEvent,
    uploadScrollActivity,
    initializeScrollTracking,
  } = useScrollTracking({
    api,
    articleID,
    articleInfo,
    readingSessionId,
    activityTimer,
    scrollHolderId: "scrollHolder",
    bottomRowId: "bottomRow",
    sampleFrequency: 1,
    source: WEB_READER,
  });

  function uploadActivity() {
    // Delegate scroll activity to the hook
    uploadScrollActivity();
  }

  useEffect(() => {
    onCreate();
    return () => {
      componentWillUnmount();
    };
    // eslint-disable-next-line
  }, []);

  const fetchBookmarks = () => {
    api.bookmarksForArticle(articleID, (bookmarks) => {
      setBookmarks(bookmarks);
    });
  };

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line
  }, [articleID]);

  const handleFocus = () => {
    onFocus(api, articleID, WEB_READER);
  };

  const handleBlur = () => {
    onBlur(api, articleID, WEB_READER);
  };

  // Scroll handling is now done by the useScrollTracking hook

  const updateViewportSize = useCallback(() => {
    try {
      let scrollElement = document.getElementById("scrollHolder");
      let bottomRow = document.getElementById("bottomRow");
      if (last_reading_percentage) {
        let currentScrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight - bottomRow.clientHeight;
        let destinationPixel = last_reading_percentage * currentScrollHeight;
        scrollElement.scrollTo({
          top: (0, destinationPixel),
          behavior: "smooth",
        });
      }
      // Viewport settings are handled automatically by useScrollTracking hook
    } catch {
      console.log("Failed to get elements to scroll.");
    }
  }, [last_reading_percentage]);

  useEffect(() => {
    if (interactiveFragments !== undefined) {
      setTimeout(() => {
        updateViewportSize();
      }, 250);
    }
  }, [interactiveFragments, last_reading_percentage, updateViewportSize]);

  function onCreate() {
    // Initialize scroll tracking using the hook
    initializeScrollTracking();

    api.getArticleInfo(articleID, (articleInfo) => {
      setInteractiveFragments(
        articleInfo.tokenized_fragments.map(
          (each) =>
            new InteractiveText(
              each.tokens,
              articleInfo.source_id,
              api,
              each.past_bookmarks,
              api.TRANSLATE_TEXT,
              articleInfo.language,
              WEB_READER,
              speech,
              each.context_identifier,
              each.formatting,
              null, // getBrowsingSessionId - not used in article reader
              getReadingSessionId,
            ),
        ),
      );
      const articleTitleData = articleInfo.tokenized_title_new;
      setInteractiveTitle(
        new InteractiveText(
          articleTitleData.tokens,
          articleInfo.source_id,
          api,
          articleTitleData.past_bookmarks,
          api.TRANSLATE_TEXT,
          articleInfo.language,
          WEB_READER,
          speech,
          articleTitleData.context_identifier,
          null, // formatting
          null, // getBrowsingSessionId
          getReadingSessionId,
        ),
      );
      setArticleInfo(articleInfo);
      setTitle(articleInfo.title);

      api.readingSessionCreate(articleID, (sessionID) => {
        setReadingSessionId(sessionID);
        api.setArticleOpened(articleInfo.id);
        api.logUserActivity(api.OPEN_ARTICLE, articleID, sessionID, WEB_READER);
      });
    });

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("beforeunload", componentWillUnmount);
  }

  function componentWillUnmount() {
    uploadActivity();
    sendFinalScrollEvent();
    api.logUserActivity(api.ARTICLE_CLOSED, articleID, "", WEB_READER);
    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("scroll", handleScroll, true);
    window.removeEventListener("beforeunload", componentWillUnmount);
    if (!clickedOnReviewVocabRef.current) {
      // If the user clicks away from the article, prioritize
      // words based on their rank.
      api.prioritizeBookmarksToStudy(articleID);
    }
  }

  if (!articleInfo || !interactiveFragments) {
    return <LoadingAnimation />;
  }

  const setLikedState = (state) => {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setAnswerSubmitted(true);
      setArticleInfo(newArticleInfo);
    });
    api.logUserActivity(api.LIKE_ARTICLE, articleID, state, WEB_READER);
  };

  const updateArticleDifficultyFeedback = (answer) => {
    let newArticleInfo = { ...articleInfo, relative_difficulty: answer };
    api.submitArticleDifficultyFeedback({ article_id: articleInfo.id, difficulty: answer }, () => {
      setAnswerSubmitted(true);
      setArticleInfo(newArticleInfo);
    });
    api.logUserActivity(api.DIFFICULTY_FEEDBACK, articleID, answer, WEB_READER);
  };
  return (
    <>
      <TopToolbar
        user={userDetails}
        teacherArticleID={teacherArticleID}
        articleID={articleID}
        translating={translateInReader}
        pronouncing={pronounceInReader}
        setTranslating={updateTranslateInReader}
        setPronouncing={updatePronounceInReader}
        url={articleInfo.url}
        UMR_SOURCE={WEB_READER}
        articleProgress={scrollPosition}
        timer={
          <DigitalTimer
            activeSessionDuration={activityTimer}
            clockActive={isTimerActive}
            showClock={true}
          ></DigitalTimer>
        }
      />

      <s.ArticleReader>
        <div id="text">
          <h1>
            <TranslatableText
              interactiveText={interactiveTitle}
              translating={translateInReader}
              pronouncing={pronounceInReader}
              setIsRendered={setReaderReady}
            />
          </h1>

          <ArticleAuthors articleInfo={articleInfo} />
          <s.ArticleInfoContainer>
            <ArticleStatInfo articleInfo={articleInfo}></ArticleStatInfo>
            <s.TopReaderButtonsContainer>
              <ArticleSource url={articleInfo.url} />
              <ReportBroken UMR_SOURCE={WEB_READER} history={history} articleID={articleID} />
            </s.TopReaderButtonsContainer>
          </s.ArticleInfoContainer>
          <hr></hr>

          <SimplificationLevelsNotice articleInfo={articleInfo} api={api} />

          {articleInfo.img_url && (
            <s.ArticleImgContainer>
              <s.ArticleImg alt="article image" src={articleInfo.img_url} />
            </s.ArticleImgContainer>
          )}

          {articleInfo.video ? (
            <iframe
              title="video-frame"
              width="620"
              height="415"
              src={"https://www.youtube.com/embed/" + extractVideoIDFromURL(articleInfo.url)}
            ></iframe>
          ) : (
            ""
          )}

          <s.MainText>
            {interactiveFragments &&
              interactiveFragments.map((interactiveText, index) => (
                <TranslatableText
                  key={index}
                  interactiveText={interactiveText}
                  translating={translateInReader}
                  pronouncing={pronounceInReader}
                  setIsRendered={setReaderReady}
                  updateBookmarks={fetchBookmarks}
                />
              ))}
          </s.MainText>
        </div>

        {readerReady && (
          <div id={"bottomRow"}>
            <ReviewVocabularyInfoBox
              articleID={articleID}
              clickedOnReviewVocab={clickedOnReviewVocab}
              setClickedOnReviewVocab={setClickedOnReviewVocab}
              bookmarks={bookmarks}
            />
            <s.CombinedBox>
              <p style={{ padding: "0em 2em 0em 2em" }}> {strings.answeringMsg} </p>
              <LikeFeedBackBox articleInfo={articleInfo} setLikedState={setLikedState} />
              <DifficultyFeedbackBox
                articleInfo={articleInfo}
                updateArticleDifficultyFeedback={updateArticleDifficultyFeedback}
              />
              {answerSubmitted && (
                <s.InvisibleBox>
                  <h3 align="center">Thank You {random(["🤗", "🙏", "😊", "🎉"])}</h3>
                </s.InvisibleBox>
              )}
            </s.CombinedBox>
          </div>
        )}
        <s.ExtraSpaceAtTheBottom />
      </s.ArticleReader>
    </>
  );
}
