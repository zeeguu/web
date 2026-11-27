import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import styled from "styled-components";
import PillSelector from "../components/PillSelector";
import { zeeguuRed, zeeguuOrange } from "../components/colors";
import { playHappyChime, playDoneChime } from "../utils/chimes";
import { PillRow, SelectablePill } from "./SuggestionSelector.sc";
import { UserContext } from "../contexts/UserContext";

// After a lesson that can be tuned (api: DailyAudioLesson.takes_feedback: an
// A0 lesson, or one above A0 written with markers): what the learner thought
// of it. Pace and repetition tune their next lessons (api:
// audio_lessons/lesson_tuning.py); the situation row moves the daily lessons
// on, or keeps them where they are. The settings these answers move (time to
// answer, A0 length) are shown and set in Settings > Audio lessons, not here:
// this box only asks. Each tap is saved at once; nothing tapped changes nothing.

// The answers describe this lesson ("Too slow"), which is what the question
// asks; the value sent is what the next lesson should do about it ("faster").
const ROWS = [
  {
    aspect: "pace",
    label: "Pace",
    options: [
      { value: "faster", pillLabel: "Too slow" },
      { value: "just_right", pillLabel: "Just right" },
      { value: "slower", pillLabel: "Too fast" },
    ],
  },
  {
    aspect: "repetition",
    label: "Repetition",
    options: [
      { value: "more", pillLabel: "Too little" },
      { value: "just_right", pillLabel: "Just right" },
      { value: "less", pillLabel: "Too much" },
    ],
  },
];

// Whether the lesson takes feedback.
// An API from before takes_feedback (api#1000) sends neither: then only A0
// lessons, as before.
export const takesFeedback = (lessonData) => lessonData.takes_feedback ?? lessonData.cefr_level === "A0";

const allAnswered = (feedback) => ROWS.every(({ aspect }) => feedback[aspect]);

// Once answered: "Thanks!" and the way to the settings the answers moved.
const ThanksLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const SettingsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${zeeguuOrange};
  text-decoration: none;
`;

const Box = styled.div`
  margin: 20px 0;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const Heading = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`;

const Note = styled.p`
  margin: -0.5rem 0 0 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const SituationLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
`;

const SituationPills = styled(PillRow)`
  flex-direction: column;
  align-items: stretch;
  margin-top: 0.4rem;

  > button {
    text-align: left;
  }
`;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${zeeguuRed};
`;

export default function LessonFeedbackBox({ lessonData, setLessonData, api }) {
  const { setUserPreferences } = useContext(UserContext);
  const [error, setError] = useState(null);
  // Once both are answered the box folds into "Thanks!" and a link to the
  // settings they moved (Settings > Audio lessons), where the seconds and
  // times are shown and can be set.
  const feedback = lessonData.feedback || {};
  const nextSituations = lessonData.next_situations || [];
  const current = lessonData.canonical_suggestion;

  function answer(aspect, value) {
    const previous = feedback[aspect];
    const next = { ...feedback, [aspect]: value };
    setError(null);
    if (aspect !== "situation" && allAnswered(next) && !allAnswered(feedback)) {
      playDoneChime();
    } else {
      playHappyChime();
    }
    setLessonData((prev) => ({ ...prev, feedback: { ...(prev.feedback || {}), [aspect]: value } }));
    // A pace or repetition answer moves that setting (Settings > Audio lessons shows it).
    const saved = (response) => {
      if (response?.answer_time == null) return;
      setUserPreferences?.((current) =>
        current
          ? {
              ...current,
              audio_lesson_answer_time: String(response.answer_time),
              ...(response.repetition != null && { audio_lesson_repetition: String(response.repetition) }),
            }
          : current,
      );
    };
    api.sendLessonFeedback(lessonData.lesson_id, aspect, value, saved, () => {
      setLessonData((prev) => ({ ...prev, feedback: { ...(prev.feedback || {}), [aspect]: previous } }));
      setError("Could not save that. Please try again.");
    });
  }

  return (
    <Box>
      {allAnswered(feedback) ? (
        <ThanksLine>
          <Heading>Thanks!</Heading>
          <SettingsLink to="/account_settings/audio_lessons">
            <SettingsRoundedIcon style={{ fontSize: "1rem" }} />
            Audio lesson settings
          </SettingsLink>
        </ThanksLine>
      ) : (
        <>
          <Heading>How was this lesson?</Heading>
          <Note>Your answers shape your next lessons.</Note>

          {ROWS.map(({ aspect, label, options }) => (
            <PillSelector
              key={aspect}
              label={label}
              options={options}
              selectedValue={feedback[aspect]}
              onChange={(value) => answer(aspect, value)}
            />
          ))}
        </>
      )}

      {nextSituations.length > 0 && current && (
        <div>
          <SituationLabel>
            Next lesson
            {lessonData.situation_lesson_count > 1 && (
              <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>
                {" "}
                · you've had {lessonData.situation_lesson_count} lessons in "{current}"
              </span>
            )}
          </SituationLabel>
          <SituationPills role="radiogroup" aria-label="Next lesson">
            {[
              { value: "stay", label: `Stay with "${current}"` },
              ...nextSituations.map((s) => ({ value: s, label: `Try "${s}"` })),
            ].map(({ value, label }) => {
              const selected = (feedback.situation || null) === value;
              return (
                <SelectablePill
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  $selected={selected}
                  onClick={() => answer("situation", value)}
                >
                  {label}
                </SelectablePill>
              );
            })}
          </SituationPills>
        </div>
      )}

      {error && <ErrorMsg>{error}</ErrorMsg>}
    </Box>
  );
}
