import StepSlider from "./StepSlider";

// How much time a lesson gives to answer (api: lesson_tuning.ANSWER_TIME_CHOICES,
// more is more time). "Too fast" / "Too slow" after a lesson move it one step,
// so the learner sees here what their answers did, and can set it themselves.
export const ANSWER_TIMES = [
  { value: -2, label: "much less" },
  { value: -1, label: "less" },
  { value: 0, label: "normal" },
  { value: 1, label: "more" },
  { value: 2, label: "much more" },
];

export const answerTimeLabel = (level) => ANSWER_TIMES.find((step) => step.value === Number(level))?.label;

/** level: the current time to answer, as the string the preference is stored as. */
export default function AnswerTimeSlider({ level, onChange }) {
  return (
    <StepSlider
      label="Time to answer"
      steps={ANSWER_TIMES}
      value={Number(level)}
      onChange={(value) => onChange(String(value))}
    />
  );
}
