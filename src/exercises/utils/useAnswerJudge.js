import { useState, useEffect, useRef } from "react";

// Asks the API about an answer other than the expected one, for an exercise
// that shows the verdict in an AnswerNote.
//
// askApi(typed, signal) resolves to {relation, explanation}. The request is
// aborted when the exercise ends some other way (Show solution), moves on
// (any of resetOn changes), or unmounts (ExerciseSession remounts each
// exercise), so a late verdict never lands on the wrong screen.
//
// judge(typed) resolves to the verdict, or to null if the request was
// abandoned meanwhile: then the caller must do nothing. It also sets the
// note: what was also right, or nearly ("Understandable, but here it's…").
export function useAnswerJudge(askApi, isExerciseOver, resetOn) {
  const [isChecking, setIsChecking] = useState(false);
  // What the API said, kept under the exercise after the reveal.
  const [note, setNote] = useState(null);
  const request = useRef(null);

  function abort() {
    request.current?.abort();
    request.current = null;
    setIsChecking(false);
  }

  useEffect(() => () => request.current?.abort(), []);

  useEffect(() => {
    if (isExerciseOver) abort();
  }, [isExerciseOver]);

  useEffect(() => {
    abort();
    setNote(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetOn);

  async function judge(typed) {
    const controller = new AbortController();
    request.current = controller;
    setIsChecking(true);
    setNote(null);
    const verdict = await askApi(typed, controller.signal);
    if (controller.signal.aborted) return null;
    request.current = null;
    setIsChecking(false);
    if (verdict.relation === "SYNONYM") {
      setNote({ kind: "alternative", typed });
    } else if (verdict.relation === "NEAR_SYNONYM_NOT_IDIOMATIC") {
      setNote({ kind: "nearMiss", typed, explanation: verdict.explanation });
    }
    return verdict;
  }

  // For an attempt that never reaches judge(), so the line about the
  // previous one doesn't stay up under it.
  function clearNote() {
    setNote(null);
  }

  return { isChecking, note, setNote, judge, clearNote };
}
