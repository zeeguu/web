import { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import LoadingAnimation from "../components/LoadingAnimation";
import { LessonWrapper, LessonTitle, SuggestionSubtitle } from "./LessonView.sc";
import { BannerContainer, BannerMessage, BannerButton } from "./SharedLessonView.sc";
import { wordsAsTile } from "./audioUtils";
import { languageNames } from "../utils/languageDetection";

export default function SharedLessonView() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const { id } = useParams();

  const [lessonData, setLessonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getSharedAudioLesson(
      id,
      (data) => setLessonData(data),
      (err) => setError(err.message || "Could not load shared lesson."),
    );
  }, [api, id]);

  if (error) {
    return (
      <LessonWrapper>
        <h2>Could not open this lesson</h2>
        <p>{error}</p>
      </LessonWrapper>
    );
  }

  if (!lessonData) {
    return (
      <LessonWrapper>
        <LoadingAnimation />
      </LessonWrapper>
    );
  }

  const lessonLang = lessonData.language_code;
  const lessonLangName = languageNames[lessonLang] || lessonLang;
  const isLearnedByUser = userDetails?.learned_language && lessonLang && userDetails.learned_language === lessonLang;
  const titleText = lessonData.title || wordsAsTile(lessonData.words) || "Shared Audio Lesson";

  const banner = isLearnedByUser
    ? {
        message: `Like this lesson? Generate your own ${lessonLangName} audio lesson on a topic you choose.`,
        actionLabel: "Go to Daily Audio",
        onAction: () => history.push("/daily-audio"),
      }
    : {
        message: `This lesson is in ${lessonLangName}. Add ${lessonLangName} to your learning languages to start your own.`,
        actionLabel: "Manage languages",
        onAction: () => history.push("/account_settings/language_settings"),
      };

  return (
    <LessonWrapper>
      <LessonTitle>{titleText}</LessonTitle>
      {lessonData.canonical_suggestion && (
        <SuggestionSubtitle>
          {lessonData.lesson_type === "situation" ? "Situation" : "Topic"}: <b>{lessonData.canonical_suggestion}</b>
        </SuggestionSubtitle>
      )}

      <CustomAudioPlayer
        src={lessonData.audio_url}
        language={lessonLang}
        title={titleText}
        artist={`${lessonLangName} Audio Lesson`}
        style={{
          width: "100%",
          marginBottom: "20px",
          maxWidth: "600px",
          margin: "0 auto 20px auto",
        }}
      />

      <ShareBanner {...banner} />
    </LessonWrapper>
  );
}

function ShareBanner({ message, actionLabel, onAction }) {
  return (
    <BannerContainer>
      <BannerMessage>{message}</BannerMessage>
      <BannerButton onClick={onAction}>{actionLabel}</BannerButton>
    </BannerContainer>
  );
}
