import { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { RoutingContext } from "../contexts/RoutingContext";
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

export const UMR_SOURCE = "UMR";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function onFocus(api, articleID, source) {
  api.logReaderActivity(api.ARTICLE_FOCUSED, articleID, "", source);
}

export function onBlur(api, articleID, source) {
  api.logReaderActivity(api.ARTICLE_UNFOCUSED, articleID, "", source);
}

export default function ArticleReader({ api, teacherArticleID }) {
  let articleID = "";
  let query = useQuery();
  teacherArticleID
    ? (articleID = teacherArticleID)
    : (articleID = query.get("id"));
  let last_reading_percentage = query.get("percentage");
  last_reading_percentage =
    last_reading_percentage === "undefined"
      ? null
      : Number(last_reading_percentage);
  const { setReturnPath } = useContext(RoutingContext); //This to be able to use Cancel correctly in EditText.

  const [articleInfo, setArticleInfo] = useState();

  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const {
    translateInReader,
    pronounceInReader,
    updateTranslateInReader,
    updatePronounceInReader,
  } = useUserPreferences(api);
  const [scrollPosition, setScrollPosition] = useState();
  const [readerReady, setReaderReady] = useState();
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [clickedOnReviewVocab, setClickedOnReviewVocab] = useState(false);
  const [viewPortSettings, setViewPortSettings] = useState("");

  const user = useContext(UserContext);
  const history = useHistory();
  const speech = useContext(SpeechContext);
  const [activityTimer, isTimerActive] = useActivityTimer(uploadActivity);
  const [readingSessionId, setReadingSessionId] = useState();

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
      api.readingSessionUpdate(
        readingSessionIdRef.current,
        activityTimerRef.current,
      );
    }
  }

  useEffect(() => {
    onCreate();
    return () => {
      componentWillUnmount();
    };
    // eslint-disable-next-line
  }, []);

  const handleFocus = () => {
    onFocus(api, articleID, UMR_SOURCE);
  };

  const handleBlur = () => {
    onBlur(api, articleID, UMR_SOURCE);
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
    if (
      currentReadingTimer - lastSampleTimer.current >=
      SCROLL_SAMPLE_FREQUENCY
    ) {
      scrollEvents.current.push([currentReadingTimer, percentage]);
      lastSampleTimer.current = currentReadingTimer;
    }
  }

  const handleScroll = () => {
    let bottomRowElement = document.getElementById("bottomRow");
    addPositionToScrollEventTracker(bottomRowElement);
  };

  useEffect(() => {
    if (interactiveText !== undefined) {
      setTimeout(() => {
        try {
          let scrollElement = document.getElementById("scrollHolder");
          let textElement = document.getElementById("text");
          let bottomRow = document.getElementById("bottomRow");
          if (last_reading_percentage) {
            let currentScrollHeight =
              scrollElement.scrollHeight -
              scrollElement.clientHeight -
              bottomRow.clientHeight;
            let destinationPixel =
              last_reading_percentage * currentScrollHeight;
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
      }, 250);
    }
  }, [interactiveText]);

  function onCreate() {
    scrollEvents.current = [];
    lastSampleTimer.current = 0;
    setScrollPosition(0);

    api.getArticleInfo(articleID, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          articleInfo.tokenized_paragraphs,
          articleInfo.id,
          true,
          api,
          articleInfo.translations,
          api.TRANSLATE_TEXT,
          articleInfo.language,
          UMR_SOURCE,
          speech,
        ),
      );
      setInteractiveTitle(
        new InteractiveText(
          articleInfo.tokenized_title,
          articleInfo.id,
          false,
          api,
          articleInfo.translations,
          api.TRANSLATE_TEXT,
          articleInfo.language,
          UMR_SOURCE,
          speech,
        ),
      );
      setArticleInfo(articleInfo);
      setTitle(articleInfo.title);

      api.readingSessionCreate(articleID, (sessionID) => {
        setReadingSessionId(sessionID);
        api.setArticleOpened(articleInfo.id);
        api.logReaderActivity(
          api.OPEN_ARTICLE,
          articleID,
          sessionID,
          UMR_SOURCE,
        );
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
    api.logReaderActivity(
      api.SCROLL,
      articleID,
      viewPortSettingsRef.current,
      JSON.stringify(scrollEvents.current).slice(0, 4096),
    );
    api.logReaderActivity("ARTICLE CLOSED", articleID, "", UMR_SOURCE);
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

  function toggleBookmarkedState() {
    let newArticleInfo = { ...articleInfo, starred: !articleInfo.starred };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(
      api.STAR_ARTICLE,
      articleID,
      readingSessionId,
      UMR_SOURCE,
    );
  }

  if (!articleInfo || !interactiveText) {
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
        },
      );
    });
  };

  const setLikedState = (state) => {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setAnswerSubmitted(true);
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(api.LIKE_ARTICLE, articleInfo.id, state, UMR_SOURCE);
  };

  const updateArticleDifficultyFeedback = (answer) => {
    let newArticleInfo = { ...articleInfo, relative_difficulty: answer };
    api.submitArticleDifficultyFeedback(
      { article_id: articleInfo.id, difficulty: answer },
      () => {
        setAnswerSubmitted(true);
        setArticleInfo(newArticleInfo);
      },
    );
    api.logReaderActivity(
      api.DIFFICULTY_FEEDBACK,
      articleInfo.id,
      answer,
      UMR_SOURCE,
    );
  };

  return (
    <>
      <TopToolbar
        user={user}
        teacherArticleID={teacherArticleID}
        articleID={articleID}
        api={api}
        interactiveText={interactiveText}
        translating={translateInReader}
        pronouncing={pronounceInReader}
        setTranslating={updateTranslateInReader}
        setPronouncing={updatePronounceInReader}
        url={articleInfo.url}
        UMR_SOURCE={UMR_SOURCE}
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
              <ReportBroken
                api={api}
                UMR_SOURCE={UMR_SOURCE}
                history={history}
                articleID={articleID}
              />
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
              src={
                "https://www.youtube.com/embed/" +
                extractVideoIDFromURL(articleInfo.url)
              }
            ></iframe>
          ) : (
            ""
          )}

          <s.MainText>
            <TranslatableText
              interactiveText={interactiveText}
              translating={translateInReader}
              pronouncing={pronounceInReader}
            />
          </s.MainText>
        </div>

        {readerReady && (
          <div id={"bottomRow"}>
            <ReviewVocabularyInfoBox
              articleID={articleID}
              clickedOnReviewVocab={clickedOnReviewVocab}
              setClickedOnReviewVocab={setClickedOnReviewVocab}
            />
            <s.CombinedBox>
              <p style={{ padding: "0em 2em 0em 2em" }}>
                {" "}
                {strings.answeringMsg}{" "}
              </p>
              <LikeFeedBackBox
                articleInfo={articleInfo}
                setLikedState={setLikedState}
              />
              <DifficultyFeedbackBox
                articleInfo={articleInfo}
                updateArticleDifficultyFeedback={
                  updateArticleDifficultyFeedback
                }
              />
              {answerSubmitted && (
                <s.InvisibleBox>
                  <h3 align="center">
                    Thank You {random(["🤗", "🙏", "😊", "🎉"])}
                  </h3>
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
