/**
 * Instruction line (and optional L2 prompt word) shown above the
 * context during an exercise. Post-reveal it goes away, so the sentence
 * rises to just under the word's progress bar instead of leaving an
 * empty band in between; the sentence glides there (useFlipOnReveal in
 * the context components) rather than jumping.
 */
export default function ExerciseInstructionHeader({ headline, l2Prompt, isExerciseOver }) {
  if (isExerciseOver) return null;
  return (
    <div>
      <div className="headlineWithMoreSpace">{headline}</div>
      {l2Prompt && <h1 className="wordInContextHeadline">{l2Prompt}</h1>}
    </div>
  );
}
