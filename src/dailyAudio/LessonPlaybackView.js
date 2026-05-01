import React, { useState } from "react";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import FeedbackModal from "../components/FeedbackModal";
import { FEEDBACK_OPTIONS, FEEDBACK_CODES_NAME } from "../components/FeedbackConstants";
import Word from "../words/Word";
import { successGreen } from "../components/colors";
import { AUDIO_STATUS } from "./AudioLessonConstants";
import { LessonWrapper, LessonTitle, SuggestionSubtitle, CompletionCheck, SubtleTextButton } from "./LessonView.sc";
import { wordsAsTile } from "./audioUtils";
import { languageNames } from "../utils/languageDetection";
import { shareLessonLink } from "./shareLessonLink";

export default function LessonPlaybackView({
  lessonData,
  setLessonData,
  words,
  error,
  api,
  userDetails,
  setUserDetails,
  listeningSession,
  currentPlaybackTime,
  setCurrentPlaybackTime,
}) {
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <LessonWrapper>
      <LessonTitle>
        {lessonData.is_completed && <CompletionCheck>✓</CompletionCheck>}
        {lessonData.title || wordsAsTile(words)}
      </LessonTitle>
      {lessonData.canonical_suggestion && (
        <SuggestionSubtitle>{lessonData.lesson_type === "situation" ? "Situation" : "Topic"}: <b>{lessonData.canonical_suggestion}</b></SuggestionSubtitle>
      )}

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      <div>

        <CustomAudioPlayer
          src={lessonData.audio_url}
          initialProgress={
            lessonData.pause_position_seconds || lessonData.position_seconds || lessonData.progress_seconds || 0
          }
          language={userDetails?.learned_language}
          title={lessonData.title || wordsAsTile(lessonData.words) || "Daily Audio Lesson"}
          artist={`${languageNames[userDetails?.learned_language] || "Zeeguu"} Audio Lesson`}
          onPlay={() => {
            if (lessonData.lesson_id) {
              api.updateLessonState(lessonData.lesson_id, "resume");
              listeningSession.start();
              setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.IN_PROGRESS }));
            }
          }}
          onPause={() => {
            listeningSession.pause();
          }}
          onProgressUpdate={(progressSeconds) => {
            setCurrentPlaybackTime(progressSeconds);
            if (lessonData.lesson_id) {
              api.updateLessonState(lessonData.lesson_id, "pause", progressSeconds);
            }
          }}
          onEnded={() => {
            listeningSession.end();
            if (lessonData.lesson_id) {
              api.updateLessonState(lessonData.lesson_id, "complete", null, () => {
                setLessonData((prev) => ({
                  ...prev,
                  is_completed: true,
                  completed_at: new Date().toISOString(),
                }));
                setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.COMPLETED }));
              });
            }
          }}
          onError={() => {}}
          style={{
            width: "100%",
            marginBottom: "20px",
            maxWidth: "600px",
            margin: "0 auto 20px auto",
          }}
        />

        {lessonData.is_completed && (
          <div
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid #28a745",
              borderRadius: "4px",
            }}
          >
            <span style={{ color: successGreen, fontWeight: "500", fontSize: "14px" }}>
              ✓ Lesson completed! Great job on finishing today's lesson.
            </span>
          </div>
        )}

        {words && words.length > 0 && (
          <div style={{ marginTop: "30px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "var(--text-primary)" }}>
              Words in this lesson
            </h3>
            {words.map((word, index) => (
              <Word
                key={index}
                bookmark={word}
                disableEdit={true}
                compact={true}
                showRanking={false}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: "40px", textAlign: "center", display: "flex", justifyContent: "center", gap: "16px" }}>
          {lessonData.lesson_id && (
            <SubtleTextButton
              onClick={() => shareLessonLink(lessonData.lesson_id, lessonData.title || wordsAsTile(lessonData.words))}
            >
              Share
            </SubtleTextButton>
          )}
          <SubtleTextButton onClick={() => setOpenFeedback(true)}>
            Feedback
          </SubtleTextButton>
          {userDetails?.name === "Mircea" && (
            <button
              onClick={() => {
                if (window.confirm("Delete today's lesson?")) {
                  api.deleteTodaysLesson(
                    () => window.location.reload(),
                    (err) => alert("Failed to delete: " + err.message),
                  );
                }
              }}
              style={{
                backgroundColor: "transparent",
                color: "var(--text-faint)",
                border: "none",
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Delete lesson
            </button>
          )}
        </div>

        <FeedbackModal
          prefixMsg={lessonData
            ? `Daily Audio Lesson - Playback time: ${Math.floor(currentPlaybackTime / 60)}:${(currentPlaybackTime % 60).toFixed(0).padStart(2, '0')} | Lesson ID: ${lessonData.lesson_id} | Words: ${wordsAsTile(lessonData.words)} | Date: ${new Date(lessonData.created_at || Date.now()).toLocaleDateString()}`
            : "Daily Audio Lesson Feedback"
          }
          open={openFeedback}
          setOpen={setOpenFeedback}
          componentCategories={FEEDBACK_OPTIONS.ALL}
          preselectedCategory={FEEDBACK_CODES_NAME.DAILY_AUDIO}
        />
      </div>
    </LessonWrapper>
  );
}
