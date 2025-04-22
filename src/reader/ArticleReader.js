import { useEffect, useState, useContext, useRef } from "react";
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
import strings from "../i18n/definitions";
import { getScrollRatio } from "../utils/misc/getScrollLocation";
import useUserPreferences from "../hooks/useUserPreferences";
import ArticleStatInfo from "../components/ArticleStatInfo";
import DigitalTimer from "../components/DigitalTimer";
import { APIContext } from "../contexts/APIContext";

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
  const [scrollPosition, setScrollPosition] = useState();
  const [readerReady, setReaderReady] = useState();
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [clickedOnReviewVocab, setClickedOnReviewVocab] = useState(false);
  const [viewPortSettings, setViewPortSettings] = useState("");

  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const speech = useContext(SpeechContext);
  const [activityTimer, isTimerActive] = useActivityTimer(uploadActivity);
  const [readingSessionId, setReadingSessionId] = useState();
  const [bookmarks, setBookmarks] = useState([]);

  const scrollEvents = useRef();

  const activityTimerRef = useShadowRef(activityTimer);
  const readingSessionIdRef = useShadowRef(readingSessionId);
  const clickedOnReviewVocabRef = useShadowRef(clickedOnReviewVocab);
  const viewPortSettingsRef = useShadowRef(viewPortSettings);

  const lastSampleTimer = useRef();
  const SCROLL_SAMPLE_FREQUENCY = 1; // Sample Every second

  function uploadActivity() {
    // It can happen that the timer already ticks before we have a reading session from the server.
    if (readingSessionIdRef.current) {
      api.readingSessionUpdate(readingSessionIdRef.current, activityTimerRef.current);
    }
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

  function addPositionToScrollEventTracker(bottomRowElement) {
    // We use this to avoid counting the feedback elements
    // as part of the article length when updating the
    // scroll bar.
    // 450 Is a default in case we can't access the property
    let bottomRowHeight = 450;
    if (bottomRowElement) {
      bottomRowHeight = bottomRowElement.offsetHeight;
    }
    let ratio = getScrollRatio(bottomRowHeight);
    setScrollPosition(ratio);
    let percentage = Math.floor(ratio * 100);
    let currentReadingTimer = activityTimerRef.current;
    if (currentReadingTimer - lastSampleTimer.current >= SCROLL_SAMPLE_FREQUENCY) {
      scrollEvents.current.push([currentReadingTimer, percentage]);
      lastSampleTimer.current = currentReadingTimer;
    }
  }

  const handleScroll = () => {
    let bottomRowElement = document.getElementById("bottomRow");
    addPositionToScrollEventTracker(bottomRowElement);
  };

  function updateViewportSize() {
    try {
      let scrollElement = document.getElementById("scrollHolder");
      let textElement = document.getElementById("text");
      let bottomRow = document.getElementById("bottomRow");
      if (last_reading_percentage) {
        let currentScrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight - bottomRow.clientHeight;
        let destinationPixel = last_reading_percentage * currentScrollHeight;
        scrollElement.scrollTo({
          top: (0, destinationPixel),
          behavior: "smooth",
        });
      }
      setViewPortSettings(
        JSON.stringify({
          scrollHeight: scrollElement.scrollHeight,
          clientHeight: scrollElement.clientHeight,
          textHeight: textElement.clientHeight,
          bottomRowHeight: bottomRow.clientHeight,
        }),
      );
    } catch {
      console.log("Failed to get elements to scroll.");
    }
  }

  useEffect(() => {
    if (interactiveFragments !== undefined) {
      setTimeout(() => {
        updateViewportSize();
      }, 250);
    }
  }, [interactiveFragments, last_reading_percentage]);

  function onCreate() {
    scrollEvents.current = [];
    lastSampleTimer.current = 0;
    setScrollPosition(0);

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
    api.logUserActivity(
      api.SCROLL,
      articleID,
      viewPortSettingsRef.current,
      JSON.stringify(scrollEvents.current).slice(0, 4096),
    );
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
              interactiveFragments.map((interactiveText) => (
                <TranslatableText
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
