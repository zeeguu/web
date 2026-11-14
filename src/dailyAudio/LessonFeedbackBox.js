import { useState } from "react";
import styled from "styled-components";
import PillSelector from "../components/PillSelector";
import { zeeguuRed } from "../components/colors";
import { PillRow, SelectablePill } from "./SuggestionSelector.sc";

// After an A0 lesson: what the learner thought of it. Pace, repetition and new
// words tune their next lessons (api: audio_lessons/lesson_tuning.py); the
// situation row moves the daily lessons on, or keeps them where they are.
// Each tap is saved at once; nothing tapped changes nothing.

const ROWS = [
  {
    aspect: "pace",
    label: "Pace",
    options: [
      { value: "slower", pillLabel: "Slower", hintDescription: "Longer pauses to answer and repeat." },
      { value: "just_right", pillLabel: "Just right" },
      { value: "faster", pillLabel: "Faster", hintDescription: "Shorter pauses." },
    ],
  },
  {
    aspect: "repetition",
    label: "Repetition",
    options: [
      { value: "more", pillLabel: "More", hintDescription: "Each word comes back more often." },
      { value: "just_right", pillLabel: "Just right" },
      { value: "less", pillLabel: "Less", hintDescription: "Fewer repeats, and a shorter lesson." },
    ],
  },
  {
    aspect: "new_words",
    label: "New words",
    options: [
      { value: "fewer", pillLabel: "Fewer", hintDescription: "A shorter conversation, fewer words to learn." },
      { value: "just_right", pillLabel: "Just right" },
      { value: "more", pillLabel: "More", hintDescription: "A longer conversation, more words to learn." },
    ],
  },
];

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
  const [error, setError] = useState(null);
  const feedback = lessonData.feedback || {};
  const nextSituations = lessonData.next_situations || [];
  const current = lessonData.canonical_suggestion;

  function answer(aspect, value) {
    const previous = feedback[aspect];
    setError(null);
    setLessonData((prev) => ({ ...prev, feedback: { ...(prev.feedback || {}), [aspect]: value } }));
    api.sendLessonFeedback(lessonData.lesson_id, aspect, value, null, () => {
      setLessonData((prev) => ({ ...prev, feedback: { ...(prev.feedback || {}), [aspect]: previous } }));
      setError("Could not save that. Please try again.");
    });
  }

  return (
    <Box>
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
