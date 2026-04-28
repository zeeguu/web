import { useEffect, useState, useContext, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { SpeechContext } from "../contexts/SpeechContext";
import { TranslatableText } from "./TranslatableText";
import InteractiveText from "./InteractiveText";

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
import useShadowRef from "../hooks/useShadowRef";
import useSwipeBack from "../hooks/useSwipeBack";
import useScrollTracking from "../hooks/useScrollTracking";
import useReadingSession from "../hooks/useReadingSession";
import strings from "../i18n/definitions";
import useUserPreferences from "../hooks/useUserPreferences";
import ArticleStatInfo from "../components/ArticleStatInfo";
import DigitalTimer from "../components/DigitalTimer";
import DevButton from "../components/DevButton";
import { APIContext } from "../contexts/APIContext";
import ArticleLanguageModal from "./ArticleLanguageModal";

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
  useSwipeBack();
  const api = useContext(APIContext);
  let articleID = "";
  let query = useQuery();
  teacherArticleID ? (articleID = teacherArticleID) : (articleID = query.get("id"));
  let last_reading_percentage = query.get("percentage");
  last_reading_percentage = last_reading_percentage === "undefined" ? null : Number(last_reading_percentage);

  const [articleInfo, setArticleInfo] = useState();
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [showSlowLoadingHint, setShowSlowLoadingHint] = useState(false);

  const [interactiveTitle, setInteractiveTitle] = useState();
  const [interactiveFragments, setInteractiveFragments] = useState();
  const { translateInReader, pronounceInReader, updateTranslateInReader, updatePronounceInReader, showMweHints, updateShowMweHints, showReadingTimer, updateShowReadingTimer } =
    useUserPreferences(api);
  const [readerReady, setReaderReady] = useState();
  const [clickedOnReviewVocab, setClickedOnReviewVocab] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isProcessingArticle, setIsProcessingArticle] = useState(false);
  const entrySource = query.get("source"); // "share", "deeplink", or null

  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const speech = useContext(SpeechContext);
  const [bookmarks, setBookmarks] = useState([]);

  // Reading session hook - starts when articleInfo is loaded
  const {
    getReadingSessionId,
    sessionDuration,
    isTimerActive,
  } = useReadingSession(articleID, "web", !!articleInfo);

  const clickedOnReviewVocabRef = useShadowRef(clickedOnReviewVocab);

  // Use the shared scroll tracking hook
  const {
    scrollPosition,
    handleScroll,
    sendFinalScrollEvent,
    uploadScrollActivity,
    initializeScrollTracking,
  } = useScrollTracking({
    api,
    articleInfo,
    getReadingSessionId,
    sessionDuration,
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
    // Reset state when articleID changes (e.g., deep link to new article)
    setArticleInfo(undefined);
    setInteractiveFragments(undefined);
    setInteractiveTitle(undefined);
    setLoadingProgress(null);
    setShowSlowLoadingHint(false);
    setBookmarks([]);
    setShowLanguageModal(false);
    setIsProcessingArticle(false);

    if (query.get("noTranslate") === "true") {
      updateTranslateInReader(false);
    }

    onCreate();
    return () => {
      componentWillUnmount();
    };
    // eslint-disable-next-line
  }, [articleID]);

  const fetchBookmarks = () => {
    api.bookmarksForArticle(articleID, (bookmarks) => {
      setBookmarks(bookmarks);
    });
  };

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line
  }, [articleID]);

  // Show "this can take a bit" hint after 5 seconds if still loading
  useEffect(() => {
    if (articleInfo) {
      setShowSlowLoadingHint(false);
      return;
    }
    const timer = setTimeout(() => setShowSlowLoadingHint(true), 5000);
    return () => clearTimeout(timer);
  }, [articleInfo]);

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

    const handleArticleLoaded = (articleInfo) => {
      setLoadingProgress(null);
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

      // Session is now created by useReadingSession hook when articleInfo becomes available
      api.setArticleOpened(articleInfo.id);
      api.logUserActivity(api.OPEN_ARTICLE, articleID, "", WEB_READER);

      // Show language modal for deeplinked articles (share is handled in SharedArticleHandler)
      if (
        entrySource === "deeplink" &&
        !articleInfo.url?.includes("#translated-from-") &&
        !teacherArticleID
      ) {
        setShowLanguageModal(true);
      }
    };

    api.getArticleInfoWithProgress(
      articleID,
      (progress) => setLoadingProgress(progress),
      handleArticleLoaded,
      (error) => {
        console.error('Failed to load article:', error);
        setLoadingProgress({ message: 'Error loading article', step: 0, total: 1 });
      }
    );

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
    return (
      <LoadingAnimation
        showReportIssue={false}
        specificStyle={{ minHeight: "70vh", justifyContent: "center" }}
      >
        {loadingProgress && (
          <div style={{ textAlign: 'center', marginTop: '1em' }}>
            <div>{loadingProgress.message}</div>
            {loadingProgress.total > 0 && (
              <div style={{ marginTop: '0.5em', color: '#666' }}>
                Step {loadingProgress.step} of {loadingProgress.total}
              </div>
            )}
          </div>
        )}
        {showSlowLoadingHint && (
          <div style={{ textAlign: 'center', marginTop: '1.5em', color: '#888', fontSize: '0.9em' }}>
            This can take a moment for longer articles...
          </div>
        )}
      </LoadingAnimation>
    );
  }

  // --- Language modal handlers ---
  const handleTranslateAndAdapt = () => {
    setIsProcessingArticle(true);
    api.translateAndAdaptArticle(
      articleInfo.url,
      userDetails.learned_language,
      (result) => {
        setIsProcessingArticle(false);
        setShowLanguageModal(false);
        history.replace("/read/article?id=" + result.id);
      },
      (error) => {
        console.error("Translation failed:", error);
        setIsProcessingArticle(false);
        setShowLanguageModal(false);
      },
    );
  };

  const handleSimplify = () => {
    setIsProcessingArticle(true);
    api.simplifyArticle(articleInfo.id, (result) => {
      setIsProcessingArticle(false);
      setShowLanguageModal(false);
      if (result.status === "success" && result.levels) {
        // Navigate to the simplified version (non-original with matching or lower level)
        const simplified = result.levels.find((l) => !l.is_original);
        if (simplified) {
          history.replace("/read/article?id=" + simplified.id);
          return;
        }
      } else {
        console.error("Simplification failed:", result.message);
      }
    });
  };

  const handleReadOriginal = () => {
    setShowLanguageModal(false);
    // Deactivate translations — they'd target a language the user isn't learning
    updateTranslateInReader(false);
  };

  const handleReadAsIs = () => {
    setShowLanguageModal(false);
  };

  const setLikedState = (state) => {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logUserActivity(api.LIKE_ARTICLE, articleID, state, WEB_READER);
  };

  const updateArticleDifficultyFeedback = (answer) => {
    let newArticleInfo = { ...articleInfo, relative_difficulty: answer };
    api.submitArticleDifficultyFeedback({ article_id: articleInfo.id, difficulty: answer }, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logUserActivity(api.DIFFICULTY_FEEDBACK, articleID, answer, WEB_READER);
  };
  return (
    <>
      {showLanguageModal && (
        <ArticleLanguageModal
          articleLanguage={articleInfo.language}
          articleCefrLevel={articleInfo.cefr_level}
          learnedLanguage={userDetails.learned_language}
          source={entrySource}
          onTranslateAndAdapt={handleTranslateAndAdapt}
          onSimplify={handleSimplify}
          onReadOriginal={handleReadOriginal}
          onReadAsIs={handleReadAsIs}
          isLoading={isProcessingArticle}
        />
      )}
      <TopToolbar
        user={userDetails}
        teacherArticleID={teacherArticleID}
        articleID={articleID}
        translating={translateInReader}
        pronouncing={pronounceInReader}
        setTranslating={updateTranslateInReader}
        setPronouncing={updatePronounceInReader}
        showMweHints={showMweHints}
        setShowMweHints={updateShowMweHints}
        showReadingTimer={showReadingTimer}
        setShowReadingTimer={updateShowReadingTimer}
        url={articleInfo.url}
        UMR_SOURCE={WEB_READER}
        articleProgress={scrollPosition}
        timer={
          showReadingTimer ? (
            <DigitalTimer
              sessionDuration={sessionDuration}
              isTimerActive={isTimerActive}
              showClock={true}
            />
          ) : null
        }
        reportBroken={
          <ReportBroken UMR_SOURCE={WEB_READER} history={history} articleID={articleID} />
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
              showMweHints={showMweHints}
            />
          </h1>

          <ArticleAuthors articleInfo={articleInfo} />
          <s.ArticleInfoContainer>
            <ArticleStatInfo articleInfo={articleInfo}></ArticleStatInfo>
            {!articleInfo.parent_url && <ArticleSource url={articleInfo.url} />}
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
              interactiveFragments.map((interactiveText, index) => (
                <TranslatableText
                  key={index}
                  interactiveText={interactiveText}
                  translating={translateInReader}
                  pronouncing={pronounceInReader}
                  setIsRendered={setReaderReady}
                  updateBookmarks={fetchBookmarks}
                  showMweHints={showMweHints}
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
            </s.CombinedBox>
          </div>
        )}
        <s.ExtraSpaceAtTheBottom />
      </s.ArticleReader>
    </>
  );
}
