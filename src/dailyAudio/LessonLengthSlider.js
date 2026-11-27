import StepSlider from "./StepSlider";

// The lengths an A0 lesson can be asked for (api: lesson_tuning.LESSON_MINUTES_CHOICES).
// "Too short" / "Too long" after a lesson move it one step, so the learner sees
// here what their answers did, and can set it themselves.
export const LESSON_MINUTES = [5, 10, 15, 20, 25];
const STEPS = LESSON_MINUTES.map((value) => ({ value, label: `about ${value} minutes` }));

/** minutes: the current length, as the string the preference is stored as. */
export default function LessonLengthSlider({ minutes, onChange }) {
  return (
    <StepSlider
      label="Lesson length"
      steps={STEPS}
      value={Number(minutes)}
      onChange={(value) => onChange(String(value))}
    />
  );
}
