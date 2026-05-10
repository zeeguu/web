import { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import CloseIconButton from "../components/CloseIconButton";
import LoadingAnimation from "../components/LoadingAnimation";
import { LessonWrapper } from "./LessonView.sc";
import { LessonCard, HeaderRow, ShareNote, BannerButton } from "./SharedLessonView.sc";
import LessonPlayerCard from "./LessonPlayerCard";
import { languageNames } from "../utils/languageDetection";
import useListeningSession from "../hooks/useListeningSession";
import { getCachedAudioUrl } from "./audioCache";

// Module-scope so it survives the AppLayout remount that fires when
// userDetails.learned_language changes (see AppLayout.js — the content tree
// is keyed on learned_language and thus fully unmounts/remounts on switch).
let lastVisitedSharedLesson = null;

export default function SharedLessonView() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const { id } = useParams();

  const [lessonData, setLessonData] = useState(null);
  const [error, setError] = useState(null);
  const [userLanguages, setUserLanguages] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  const activeLanguage = userDetails?.learned_language;
  const shouldRedirectAfterLanguageSwitch =
    !!activeLanguage &&
    !!lastVisitedSharedLesson &&
    lastVisitedSharedLesson.id === id &&
    lastVisitedSharedLesson.language !== activeLanguage;

  useEffect(() => {
    if (shouldRedirectAfterLanguageSwitch) return;
    api.getSharedAudioLesson(
      id,
      (data) => setLessonData(data),
      (err) => setError(err.message || "Could not load shared lesson."),
    );
    api.getUserLanguages((langs) => setUserLanguages(langs || []));
  }, [api, id, shouldRedirectAfterLanguageSwitch]);

  useEffect(() => {
    if (shouldRedirectAfterLanguageSwitch) {
      lastVisitedSharedLesson = null;
      history.replace("/daily-audio");
      return;
    }
    if (!id || !activeLanguage) return;
    lastVisitedSharedLesson = { id, language: activeLanguage };
  }, [id, activeLanguage, history, shouldRedirectAfterLanguageSwitch]);

  const handleClose = () => {
    lastVisitedSharedLesson = null;
    history.push("/daily-audio");
  };

  // Hook before any early return so the hook order stays stable across renders.
  // Pass null when the user isn't learning this lesson's language → useListeningSession
  // short-circuits internally and no session is recorded.
  const lessonLang = lessonData?.language_code;
  const isLearningLanguage = !!(
    lessonLang && userLanguages?.some((l) => l.code === lessonLang)
  );
  const listeningSession = useListeningSession(
    isLearningLanguage ? lessonData?.lesson_id : null,
  );

  useEffect(() => {
    if (!lessonData?.audio_url) return;
    let cancelled = false;
    getCachedAudioUrl(lessonData.lesson_id, lessonData.audio_url).then((url) => {
      if (!cancelled) setAudioSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [lessonData?.lesson_id, lessonData?.audio_url]);

  if (error) {
    return (
      <LessonWrapper>
        <LessonCard>
          <HeaderRow>
            <h2>Could not open this lesson</h2>
            <CloseIconButton onClick={handleClose} ariaLabel="Close shared lesson" />
          </HeaderRow>
          <p>{error}</p>
        </LessonCard>
      </LessonWrapper>
    );
  }

  if (!lessonData || userLanguages === null || !audioSrc) {
    return (
      <LessonWrapper>
        <LoadingAnimation />
      </LessonWrapper>
    );
  }

  const lessonLangName = languageNames[lessonLang] || lessonLang;
  const isActiveLanguage = userDetails?.learned_language === lessonLang;
  const titleText = lessonData.title || "Shared Audio Lesson";

  let banner;
  if (isActiveLanguage) {
    banner = {
      message: `Like this lesson? Generate your own ${lessonLangName} audio lesson on a topic you choose.`,
      actionLabel: "Go to Daily Audio",
      onAction: () => history.push("/daily-audio"),
    };
  } else if (isLearningLanguage) {
    banner = {
      message: `You're learning ${lessonLangName} but it's not your active language. Switch to ${lessonLangName} to make this count toward today's progress.`,
      actionLabel: "Switch active language",
      onAction: () => history.push("/account_settings/language_settings"),
    };
  } else {
    banner = {
      message: `This lesson is in ${lessonLangName}. Add ${lessonLangName} to your learning languages to start your own.`,
      actionLabel: "Manage languages",
      onAction: () => history.push("/account_settings/language_settings"),
    };
  }

  const metadata = (
    <>
      Language: <b>{lessonLangName}</b>
      {lessonData.canonical_suggestion && (
        <>
          {" · "}
          {lessonData.lesson_type === "situation" ? "Situation" : "Topic"}: <b>{lessonData.canonical_suggestion}</b>
        </>
      )}
    </>
  );

  return (
    <LessonWrapper>
      <LessonPlayerCard
        title={titleText}
        metadata={metadata}
        headerAction={<CloseIconButton onClick={handleClose} ariaLabel="Close shared lesson" />}
        audioProps={{
          src: audioSrc,
          language: lessonLang,
          title: titleText,
          artist: `${lessonLangName} Audio Lesson`,
          onPlay: () => listeningSession.start(),
          onPause: () => listeningSession.pause(),
          onEnded: () => listeningSession.end(),
        }}
      />

      <ShareNote>
        <div>{banner.message}</div>
        <BannerButton onClick={banner.onAction}>{banner.actionLabel}</BannerButton>
      </ShareNote>
    </LessonWrapper>
  );
}
