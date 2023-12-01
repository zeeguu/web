/*global chrome*/
import { useState, useEffect, useRef } from "react";

import { StyledModal,StyledHeading, GlobalStyle, OverwriteZeeguu,} from "./Modal.styles";

import { StyledCloseButton } from "./Buttons.styles";
import FloatingMenu from './FloatingMenu';
import ZeeguuLoader from "../ZeeguuLoader";
import UserFeedback from "./UserFeedback";

import { EXTENSION_SOURCE } from "../constants";

import { onScroll } from "../../zeeguu-react/src/reader/ArticleReader";
import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText";
import { getMainImage } from "../Cleaning/generelClean";
import { interactiveTextsWithTags } from "./interactiveTextsWithTags";
import { getNativeLanguage, getUsername } from "../../popup/functions";
import { ReadArticle } from "./ReadArticle";
import WordsForArticleModal from "./WordsForArticleModal";
import Exercises from "../../zeeguu-react/src/exercises/Exercises";
import ToolbarButtons from "./ToolbarButtons";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";
import { cleanDOMAfter, getHTMLContent } from "../Cleaning/pageSpecificClean";

import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import SaveToZeeguu from "./SaveToZeeguu";
import colors from "../colors";

import {SpeechContext} from "../../zeeguu-react/src/exercises/SpeechContext";
import ZeeguuSpeech from "../../zeeguu-react/src/speech/ZeeguuSpeech";

import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';

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

  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(true);

  const [articleInfo, setArticleInfo] = useState();
  const [interactiveTextArray, setInteractiveTextArray] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [nativeLang, setNativeLang] = useState();
  const [username, setUsername] = useState();

  const [loadingPersonalCopy, setLoadingPersonalCopy] = useState(true);
  const [personalCopySaved, setPersonalCopySaved] = useState(false);
  const [articleImage, setarticleImage] = useState();

  const [logContext, setLogContext] = useState("ARTICLE");
  const logContextRef = useRef({});
  logContextRef.current = logContext;
  const articleInfoRef = useRef({});
  articleInfoRef.current = articleInfo;

  const openSettings = () => {
    window.open('https://www.zeeguu.org/account_settings', '_blank');
  };

  const buttons = [
    <UserFeedback api={api} articleId={articleId} url={url} />,
    <Button  style={{ textTransform: 'none', justifyContent:'space-between', fontSize: '0.9rem', fontWeight: '200', backgroundColor:`${colors.lighterBlue}`, color: `${colors.black}`}} key="two" onClick={openSettings}>Settings <SettingsIcon sx={{ fontSize: '0.9rem' }}/></Button>,
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

  function logFocus() {
    api.logReaderActivity(
      logContextRef.current + " FOCUSED",
      articleId(),
      "",
      "EXTENSION"
    );
  }

  function logBlur() {
    api.logReaderActivity(
      logContextRef.current + " LOST FOCUS",
      articleId(),
      "",
      "EXTENSION"
    );
  }

  useEffect(() => {
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
      });
    }
    getNativeLanguage().then((result) => setNativeLang(result));
    getUsername().then((result) => setUsername(result));
    setarticleImage(getMainImage(getHTMLContent(url), url));

    window.addEventListener("focus", logFocus);
    window.addEventListener("blur", logBlur);

    return () => {
      window.removeEventListener("focus", logFocus);
      window.removeEventListener("blur", logBlur);
    };
  }, []);

  useEffect(() => {
    if (articleInfo !== undefined) {
      let arrInteractive = interactiveTextsWithTags(content, articleInfo, api);
      setInteractiveTextArray(arrInteractive);
      let itTitle = new InteractiveText(
        title,
        articleInfo,
        api,
        api.TRANSLATE_TEXT,
        EXTENSION_SOURCE
      );
      setInteractiveTitle(itTitle);
      api.logReaderActivity(
        api.OPEN_ARTICLE,
        articleId(),
        "",
        EXTENSION_SOURCE
      );

      api.getOwnTexts((articles) => {
        checkOwnTexts(articles);
        setLoadingPersonalCopy(false);
      });

      let getModalClass = document.getElementsByClassName("Modal");
      if (getModalClass !== undefined && getModalClass !== null) {
        setTimeout(() => {
          if (getModalClass.item(0) !== undefined) {
            getModalClass.item(0).addEventListener("scroll", function () {
              onScroll(api, articleId(), EXTENSION_SOURCE);
            });
          }
        }, 0);
      }

      let se = new ZeeguuSpeech(api, articleInfo.language);
      setSpeechEngine(se);

    }

    cleanDOMAfter(url);
  }, [articleInfo]);

  localStorage.setItem("native_language", nativeLang);
  localStorage.setItem("name", username);

  function handleClose() {
    setModalIsOpen(false);
    api.logReaderActivity("ARTICLE CLOSED", articleId(), "", EXTENSION_SOURCE);
    window.removeEventListener("focus", logFocus);
    window.removeEventListener("blur", logBlur);
    document.getElementById("scrollHolder") !== null &&
      document
        .getElementById("scrollHolder")
        .removeEventListener("scroll", function () {
          onScroll(api, articleId(), EXTENSION_SOURCE);
        });
    location.reload();
  }

  if (!modalIsOpen) {
    location.reload();
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
    setExerciseOpen(true);
    setReviewOpen(false);
    setLogContext("EXERCISES");
    api.logReaderActivity(
      api.TO_EXERCISES_AFTER_REVIEW,
      articleId(),
      "",
      EXTENSION_SOURCE
    );
  }

  function reloadExercises() {
    setExerciseOpen(false);
    setTimeout(() => {
      setExerciseOpen(true);
    }, 0);
  }

  function openArticle() {
    setReadArticleOpen(true);
    setExerciseOpen(false);
    setReviewOpen(false);
    setLogContext("ARTICLE");
  }

  if (interactiveTextArray === undefined || loadingPersonalCopy) {
    return <ZeeguuLoader />;
  }

  return (
    <>
      <div>
      <SpeechContext.Provider value={speechEngine}>
      <GlobalStyle />
      <StyledModal
        isOpen={modalIsOpen}
        className="Modal"
        id="scrollHolder"
        overlayClassName={"reader-overlay"}
      >
        <OverwriteZeeguu>
          <StyledHeading>
            <div style={{ "float": "left", "max-width": "50%",  "display":"inline-flex", "padding": "1.5em"}}>
              <div>
              <img
                    src={chrome.runtime.getURL("images/zeeguuLogo.svg")}
                    alt={"Zeeguu logo"}
                    className="logoModal"
                />
              </div> 
              <SaveToZeeguu
              api={api}
              articleId={articleId()}
              setPersonalCopySaved={setPersonalCopySaved}
              personalCopySaved={personalCopySaved} />
            </div>
            <div style={{ "float": "right", "width": "50%",  "display":"inline"}}>
              <StyledCloseButton role="button" onClick={handleClose} id="qtClose">
                <CloseSharpIcon sx={{color: colors.gray}}/>
              </StyledCloseButton>
              {readArticleOpen ? (
                <ToolbarButtons
                  translating={translating}
                  pronouncing={pronouncing}
                  setTranslating={setTranslating}
                  setPronouncing={setPronouncing}
                />
              ) : null}
            </div>
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
              translating={translating}
              pronouncing={pronouncing}
              url={url}
              setPersonalCopySaved={setPersonalCopySaved}
              personalCopySaved={personalCopySaved}
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
          {exerciseOpen === true && (
            <>
              <Exercises
                className="exercises"
                api={api}
                articleID={articleId()}
                openExercises={openExercises}
                openArticle={openArticle}
              />
            </>
          )}
        </OverwriteZeeguu>   
      </StyledModal>  
      </SpeechContext.Provider>      
    </div>
    <FloatingMenu buttons={buttons} buttonGroupVisible={buttonGroupVisible} toggleButtonGroup={toggleButtonGroup} />
    </>
  );
}