/*global chrome*/
import { useState, useEffect, useRef } from "react";

import {
  StyledModal,
  StyledHeading,
  GlobalStyle,
  OverwriteZeeguu,
} from "./Modal.styles";

import { StyledCloseButton, StyledSmallButton } from "./Buttons.styles";
import FloatingMenu from "./FloatingMenu";
import ZeeguuLoader from "../ZeeguuLoader";
import UserFeedback from "./UserFeedback";

import { EXTENSION_SOURCE } from "../constants";

import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText";
import { getMainImage } from "../Cleaning/generelClean";
import { interactiveTextsWithTags } from "./interactiveTextsWithTags";
import { getNativeLanguage, getUsername } from "../../popup/functions";
import { ReadArticle } from "./ReadArticle";
import WordsForArticleModal from "./WordsForArticleModal";
import ToolbarButtons from "./ToolbarButtons";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";
import { getHTMLContent } from "../Cleaning/pageSpecificClean";
import { BROWSER_API } from "../../utils/browserApi";

import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import SaveToZeeguu from "./SaveToZeeguu";
import colors from "../colors";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import { SpeechContext } from "../../zeeguu-react/src/contexts/SpeechContext";
import ZeeguuSpeech from "../../zeeguu-react/src/speech/APIBasedSpeech";
import useActivityTimer from "../../zeeguu-react/src/hooks/useActivityTimer";
import useShadowRef from "../../zeeguu-react/src/hooks/useShadowRef";
import ratio from "../../zeeguu-react/src/utils/basic/ratio";

import ActivityTimer from "../../zeeguu-react/src/components/ActivityTimer";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import ZeeguuError from "../ZeeguuError";
import { WEB_URL } from "../../config.js";
import useUserPreferences from "../../zeeguu-react/src/hooks/useUserPreferences.js";

export function Modal({
  title,
  content,
  modalIsOpen,
  setModalIsOpen,
  api,
  url,
  author,
}) {
  const [readArticleOpen, setReadArticleOpen] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState();
  const {
    translateInReader,
    pronounceInReader,
    updateTranslateInReader,
    updatePronounceInReader,
  } = useUserPreferences(api);

  const [articleInfo, setArticleInfo] = useState();
  const [interactiveTextArray, setInteractiveTextArray] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [nativeLang, setNativeLang] = useState();
  const [username, setUsername] = useState();
  const [isHovered, setIsHovered] = useState(false);

  const [loadingPersonalCopy, setLoadingPersonalCopy] = useState(true);
  const [personalCopySaved, setPersonalCopySaved] = useState(false);
  const [articleImage, setarticleImage] = useState();

  const [logContext, setLogContext] = useState("ARTICLE");
  const logContextRef = useRef({});

  logContextRef.current = logContext;
  const articleInfoRef = useRef({});
  articleInfoRef.current = articleInfo;

  const [activeSessionDuration, clockActive] = useActivityTimer(uploadActivity);
  const [readingSessionId, setReadingSessionId] = useState();

  const activeSessionDurationRef = useShadowRef(activeSessionDuration);
  const readingSessionIdRef = useShadowRef(readingSessionId);

  function uploadActivity() {
    if (readingSessionIdRef.current)
      api.readingSessionUpdate(
        readingSessionIdRef.current,
        activeSessionDurationRef.current
      );
  }

  const [scrollPosition, setScrollPosition] = useState();
  const scrollEvents = useRef();
  const lastSampleScroll = useRef();
  const SCROLL_SAMPLE_FREQUENCY = 1; // Sample Every second

  const openSettings = () => {
    window.open("https://www.zeeguu.org/account_settings", "_blank");
  };

  const buttons = [
    <UserFeedback api={api} articleId={articleId} url={url} />,
    <Button
      style={{
        textTransform: "none",
        justifyContent: "space-between",
        fontSize: "0.9rem",
        fontWeight: "200",
        backgroundColor: `${colors.lighterBlue}`,
        color: `${colors.black}`,
      }}
      key="two"
      onClick={openSettings}
    >
      Settings <SettingsIcon sx={{ fontSize: "0.9rem" }} />
    </Button>,
  ];

  const [buttonGroupVisible, setButtonGroupVisible] = useState(false);

  const toggleButtonGroup = () => {
    setButtonGroupVisible(!buttonGroupVisible);
  };
  const [speechEngine, setSpeechEngine] = useState();

  useUILanguage();

  function articleId() {
    return articleInfoRef.current.id;
  }

  function getScrollRatio() {
    let scrollElement = document.getElementById("scrollHolder");
    let scrollY = scrollElement.scrollTop;
    let bottomRowHeight = document.getElementById("bottomRow");
    if (!bottomRowHeight) {
      bottomRowHeight = 450; // 450 Is a default in case we can't acess the property
    } else {
      bottomRowHeight = bottomRowHeight.offsetHeight;
    }
    let endArticle =
      scrollElement.scrollHeight - scrollElement.clientHeight - bottomRowHeight;
    let ratioValue = ratio(scrollY, endArticle);
    // Should we allow the ratio to go above 1?
    // Above 1 is the area where the feedback + exercises are.
    return ratioValue;
  }

  const handleScroll = () => {
    let ratio = getScrollRatio();
    setScrollPosition(ratio);
    let percentage = Math.floor(ratio * 100);
    let currentSessionDuration = activeSessionDurationRef.current;
    if (
      currentSessionDuration - lastSampleScroll.current >=
      SCROLL_SAMPLE_FREQUENCY
    ) {
      scrollEvents.current.push([currentSessionDuration, percentage]);
      lastSampleScroll.current = currentSessionDuration;
    }
  };

  function logFocus() {
    api.logReaderActivity(
      logContextRef.current + " FOCUSED",
      articleId(),
      "",
      EXTENSION_SOURCE
    );
  }

  function logBlur() {
    api.logReaderActivity(
      logContextRef.current + " LOST FOCUS",
      articleId(),
      "",
      EXTENSION_SOURCE
    );
  }
  useEffect(() => {
    const timedOutTimer = setTimeout(() => {
      setIsTimedOut(true);
    }, 10000);
    scrollEvents.current = [];
    lastSampleScroll.current = 0;
    setScrollPosition(0);
    if (content !== undefined) {
      let info = {
        url: url,
        htmlContent: content,
        title: title,
        authors: author,
      };
      api.findOrCreateArticle(info, (result_dict) => {
        if (result_dict.includes("Language not supported")) {
          return alert("not readable");
        }
        let artinfo = JSON.parse(result_dict);
        console.log("ARTICLE INFO in the Modal JS constructore...: ");
        console.dir(artinfo);
        setArticleInfo(artinfo);
        let engine = new ZeeguuSpeech(api, artinfo.language);
        setSpeechEngine(engine);
        let arrInteractive = interactiveTextsWithTags(
          content,
          artinfo,
          engine,
          api
        );
        setInteractiveTextArray(arrInteractive);

        let itTitle = new InteractiveText(
          title,
          artinfo,
          api,
          api.TRANSLATE_TEXT,
          EXTENSION_SOURCE,
          engine
        );
        setInteractiveTitle(itTitle);
        api.getOwnTexts((articles) => {
          checkOwnTexts(articles);
          setLoadingPersonalCopy(false);
        });
        api.readingSessionCreate(artinfo.id, (sessionID) => {
          setReadingSessionId(sessionID);
          api.setArticleOpened(artinfo.id);
          api.logReaderActivity(
            api.OPEN_ARTICLE,
            artinfo.id,
            sessionID,
            EXTENSION_SOURCE
          );
          clearTimeout(timedOutTimer);
        });
      });
    }
    getNativeLanguage().then((result) => setNativeLang(result));
    getUsername().then((result) => setUsername(result));
    setarticleImage(getMainImage(getHTMLContent(url), url));

    window.addEventListener("focus", logFocus);
    window.addEventListener("blur", logBlur);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("beforeunload", handleClose, true);
    return () => {
      window.removeEventListener("focus", logFocus);
      window.removeEventListener("blur", logBlur);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("beforeunload", handleClose, true);
    };
  }, []);

  localStorage.setItem("native_language", nativeLang);
  localStorage.setItem("name", username);

  function handleClose() {
    setModalIsOpen(false);
    uploadActivity();
    api.logReaderActivity(
      api.SCROLL,
      articleId(),
      scrollEvents.current.length,
      JSON.stringify(scrollEvents.current).slice(0, 4096),
      EXTENSION_SOURCE
    );
    api.logReaderActivity(
      api.ARTICLE_CLOSED,
      articleId(),
      "",
      EXTENSION_SOURCE
    );
    window.removeEventListener("focus", logFocus);
    window.removeEventListener("blur", logBlur);
    window.removeEventListener("scroll", handleScroll, true);
    window.location.reload();
  }

  if (!modalIsOpen) {
    window.location.reload();
  }

  function checkOwnTexts(articles) {
    if (articles.length !== 0) {
      for (var i = 0; i < articles.length; i++) {
        if (articles[i].id === articleId()) {
          setPersonalCopySaved(true);
          break;
        }
      }
    }
  }

  function openReview() {
    setLogContext("WORDS REVIEW");
    setReviewOpen(true);
    setReadArticleOpen(false);
    setExerciseOpen(false);
  }

  function openExercises() {
    window.open(`${WEB_URL}/exercises/forArticle/${articleId()}`);
  }

  function openArticle() {
    setReadArticleOpen(true);
    setExerciseOpen(false);
    setReviewOpen(false);
    setLogContext("ARTICLE");
  }

  const setLikedState = (state) => {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setAnswerSubmitted(true);
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(
      api.LIKE_ARTICLE,
      articleInfo.id,
      state,
      EXTENSION_SOURCE
    );
  };

  const updateArticleDifficultyFeedback = (answer) => {
    let newArticleInfo = { ...articleInfo, relative_difficulty: answer };
    api.submitArticleDifficultyFeedback(
      { article_id: articleInfo.id, difficulty: answer },
      () => {
        setAnswerSubmitted(true);
        setArticleInfo(newArticleInfo);
      }
    );
    api.logReaderActivity(
      api.DIFFICULTY_FEEDBACK,
      articleInfo.id,
      answer,
      EXTENSION_SOURCE
    );
  };

  if (
    (interactiveTextArray === undefined || loadingPersonalCopy) &&
    isTimedOut === undefined
  ) {
    return <ZeeguuLoader />;
  }
  if (isTimedOut) {
    return <ZeeguuError api={api} isTimeout={isTimedOut} />;
  }
  return (
    <>
      <SpeechContext.Provider value={speechEngine}>
        <div>
          <GlobalStyle />

          <StyledModal
            isOpen={modalIsOpen}
            className="Modal"
            id="scrollHolder"
            overlayClassName={"reader-overlay"}
          >
            {readArticleOpen && (
              <ActivityTimer
                message="Seconds in this reading session"
                activeSessionDuration={activeSessionDuration}
                clockActive={clockActive}
              />
            )}
            <OverwriteZeeguu>
              <StyledHeading>
                <div
                  style={{
                    float: "left",
                    "max-width": "50%",
                    display: "inline-flex",
                    padding: "1.5em",
                  }}
                >
                  <StyledSmallButton>
                    <a href="https://www.zeeguu.org">
                      <img
                        src={BROWSER_API.runtime.getURL(
                          "images/zeeguuLogo.svg"
                        )}
                        alt={"Zeeguu logo"}
                        className="logoModal"
                      />
                    </a>{" "}
                    <br />
                    <span>Home</span>
                  </StyledSmallButton>
                  <SaveToZeeguu
                    api={api}
                    articleId={articleId()}
                    setPersonalCopySaved={setPersonalCopySaved}
                    personalCopySaved={personalCopySaved}
                  />
                  <div>
                    <StyledSmallButton
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onClick={openReview}
                    >
                      {isHovered ? (
                        <FactCheckIcon fontSize="large" />
                      ) : (
                        <FactCheckOutlinedIcon fontSize="large" />
                      )}{" "}
                      <br />
                      <span>Words</span>
                    </StyledSmallButton>
                  </div>
                </div>
                <div
                  style={{ float: "right", width: "50%", display: "inline" }}
                >
                  <StyledCloseButton
                    role="button"
                    onClick={handleClose}
                    id="qtClose"
                  >
                    <CloseSharpIcon sx={{ color: colors.gray }} />
                  </StyledCloseButton>
                  {readArticleOpen ? (
                    <ToolbarButtons
                      translating={translateInReader}
                      pronouncing={pronounceInReader}
                      setTranslating={updateTranslateInReader}
                      setPronouncing={updatePronounceInReader}
                    />
                  ) : null}
                </div>
                {readArticleOpen && <progress value={scrollPosition} />}
              </StyledHeading>
              {readArticleOpen === true && (
                <ReadArticle
                  articleId={articleId()}
                  api={api}
                  author={author}
                  interactiveTextArray={interactiveTextArray}
                  interactiveTitle={interactiveTitle}
                  articleImage={articleImage}
                  openReview={openReview}
                  translating={translateInReader}
                  pronouncing={pronounceInReader}
                  url={url}
                  setPersonalCopySaved={setPersonalCopySaved}
                  personalCopySaved={personalCopySaved}
                  articleInfo={articleInfo}
                  setLikedState={setLikedState}
                  updateArticleDifficultyFeedback={
                    updateArticleDifficultyFeedback
                  }
                  answerSubmitted={answerSubmitted}
                />
              )}

              {reviewOpen === true && (
                <WordsForArticleModal
                  className="wordsForArticle"
                  api={api}
                  articleID={articleId()}
                  openExercises={openExercises}
                  openArticle={openArticle}
                />
              )}
            </OverwriteZeeguu>
          </StyledModal>
        </div>
      </SpeechContext.Provider>

      <FloatingMenu
        buttons={buttons}
        buttonGroupVisible={buttonGroupVisible}
        toggleButtonGroup={toggleButtonGroup}
      />
    </>
  );
}
