/**
 * Instruction line (and optional L2 prompt word) shown above the
 * context during an exercise. Post-reveal we keep the block in the
 * layout as visibility:hidden so the sentence below doesn't rise into
 * freed space — the chip appearing above the answer word naturally
 * drifts the sentence slightly down, which feels right; removing the
 * header entirely makes it shoot up, which doesn't.
 */
export default function ExerciseInstructionHeader({ headline, l2Prompt, isExerciseOver }) {
  return (
    <div style={{ visibility: isExerciseOver ? "hidden" : "visible" }} aria-hidden={isExerciseOver}>
      <div className="headlineWithMoreSpace">{headline}</div>
      {l2Prompt && <h1 className="wordInContextHeadline">{l2Prompt}</h1>}
    </div>
  );
}
