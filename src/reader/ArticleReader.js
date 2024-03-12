import { useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { RoutingContext } from "../contexts/RoutingContext";
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
import ReviewVocabulary from "./ReviewVocabulary";
import ArticleAuthors from "./ArticleAuthors";
import useActivityTimer from "../hooks/useActivityTimer";
import ActivityTimer from "../components/ActivityTimer";
import useShadowRef from "../hooks/useShadowRef";
import strings from "../i18n/definitions";


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
  const [pronouncing, setPronouncing] = useState(true);
  const user = useContext(UserContext);
  const history = useHistory();
  const speech = useContext(SpeechContext);
  const [activeSessionDuration, clockActive] = useActivityTimer(uploadActivity);
  const [readingSessionId, setReadingSessionId] = useState();

  const activeSessionDurationRef = useShadowRef(activeSessionDuration);
  const readingSessionIdRef = useShadowRef(readingSessionId);

  function uploadActivity() {
    api.readingSessionUpdate(
      readingSessionIdRef.current,
      activeSessionDurationRef.current,
    );
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

  const handleScroll = () => {
    onScroll(api, articleID, UMR_SOURCE);
  };

  function onCreate() {
    api.getArticleInfo(articleID, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          articleInfo.content,
          articleInfo,
          api,
          api.TRANSLATE_TEXT,
          UMR_SOURCE,
          speech,
        ),
      );
      setInteractiveTitle(
        new InteractiveText(
          articleInfo.title,
          articleInfo,
          api,
          api.TRANSLATE_TEXT,
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
    window.addEventListener("scroll", handleScroll);
  }

  function componentWillUnmount() {
    uploadActivity();
    api.logReaderActivity("ARTICLE CLOSED", articleID, "", UMR_SOURCE);

    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("scroll", handleScroll);
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
        },
      );
    });
  };

  return (
    <s.ArticleReader>
      <ActivityTimer
        message="Seconds in this reading session"
        activeSessionDuration={activeSessionDuration}
        clockActive={clockActive}
      />

      <TopToolbar
        user={user}
        teacherArticleID={teacherArticleID}
        articleID={articleID}
        api={api}
        interactiveText={interactiveText}
        translating={translating}
        pronouncing={pronouncing}
        setTranslating={setTranslating}
        setPronouncing={setPronouncing}
        url={articleInfo.url}
        UMR_SOURCE={UMR_SOURCE}
      />
      <h1>
        <TranslatableText
          interactiveText={interactiveTitle}
          translating={translating}
          pronouncing={pronouncing}
        />
      </h1>
      <div
        style={{
          marginTop: "1em",
          marginBottom: "2em",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ArticleAuthors articleInfo={articleInfo} />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <ArticleSource url={articleInfo.url} />
          <ReportBroken
            api={api}
            UMR_SOURCE={UMR_SOURCE}
            history={history}
            articleID={articleID}
          />
        </div>
      </div>

      {articleInfo.video ? (
        <iframe
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
          translating={translating}
          pronouncing={pronouncing}
        />
      </s.MainText>
      <ReviewVocabulary articleID={articleID} />
      <s.FeedbackBox>
        <h4> {strings.answeringMsg} </h4>
        <LikeFeedBackBox
          api={api}
          articleID={articleID}
          articleInfo={articleInfo}
          setArticleInfo={setArticleInfo}
          source={UMR_SOURCE}
        />
        <DifficultyFeedbackBox api={api} articleID={articleID} />
      </s.FeedbackBox>
      <s.ExtraSpaceAtTheBottom />
    </s.ArticleReader>
  );
}
