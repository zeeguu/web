import { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import LoadingAnimation from "../components/LoadingAnimation";
import { LessonWrapper, LessonTitle, SuggestionSubtitle } from "./LessonView.sc";
import { wordsAsTile } from "./audioUtils";
import { languageNames } from "../utils/languageDetection";
import { zeeguuOrange } from "../components/colors";

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
  const userLearns = userDetails?.learned_language;
  const isLearnedByUser = userLearns && lessonLang && userLearns === lessonLang;
  const lessonLangName = languageNames[lessonLang] || lessonLang;

  return (
    <LessonWrapper>
      <LessonTitle>
        {lessonData.title || wordsAsTile(lessonData.words)}
      </LessonTitle>
      {lessonData.canonical_suggestion && (
        <SuggestionSubtitle>
          {lessonData.lesson_type === "situation" ? "Situation" : "Topic"}: <b>{lessonData.canonical_suggestion}</b>
        </SuggestionSubtitle>
      )}

      <CustomAudioPlayer
        src={lessonData.audio_url}
        language={lessonLang}
        title={lessonData.title || wordsAsTile(lessonData.words) || "Shared Audio Lesson"}
        artist={`${lessonLangName} Audio Lesson`}
        style={{
          width: "100%",
          marginBottom: "20px",
          maxWidth: "600px",
          margin: "0 auto 20px auto",
        }}
      />

      {isLearnedByUser ? (
        <ShareBanner
          message={`Like this lesson? Generate your own ${lessonLangName} audio lesson on a topic you choose.`}
          actionLabel="Go to Daily Audio"
          onAction={() => history.push("/daily-audio")}
        />
      ) : (
        <ShareBanner
          message={`This lesson is in ${lessonLangName}. Add ${lessonLangName} to your learning languages to start your own.`}
          actionLabel="Manage languages"
          onAction={() => history.push("/account_settings/language_settings")}
        />
      )}
    </LessonWrapper>
  );
}

function ShareBanner({ message, actionLabel, onAction }) {
  return (
    <div
      style={{
        marginTop: "30px",
        padding: "16px",
        backgroundColor: "var(--bg-secondary)",
        border: `1px solid ${zeeguuOrange}`,
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <div style={{ color: "var(--text-primary)", fontSize: "14px" }}>{message}</div>
      <button
        onClick={onAction}
        style={{
          backgroundColor: zeeguuOrange,
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "8px 16px",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
