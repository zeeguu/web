import { useState, useEffect } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import strings from "../../i18n/definitions.js";
import { removePunctuation } from "../../utils/text/preprocessing";

// A verdict already stored for this meaning comes back in a database round
// trip; only an actual LLM call (1-3 s) outlasts this, so only that shows the
// spinner instead of flashing it on every other word.
const SHOW_THINKING_AFTER_MS = 400;

// What the API's judge said about an answer other than the expected one
// (see useAnswerJudge), as one line under the exercise.
// `expected` is what the exercise wanted; `isTranslation` says whether the
// learner typed the word they are learning (cloze) or its translation.
// A near miss in a translate exercise leaves it open for another try, so
// until `isExerciseOver` the line names neither the answer nor the meaning.
export default function AnswerNote({ isChecking, note, expected, isExerciseOver = true, isTranslation = false }) {
  const [showThinking, setShowThinking] = useState(false);

  useEffect(() => {
    if (!isChecking) return;
    const timer = setTimeout(() => setShowThinking(true), SHOW_THINKING_AFTER_MS);
    return () => {
      clearTimeout(timer);
      setShowThinking(false);
    };
  }, [isChecking]);

  if (isChecking) {
    if (!showThinking) return null;
    return (
      <AnswerLine>
        <CircularProgress size={14} sx={{ color: "var(--text-secondary)", verticalAlign: "-2px", marginRight: "0.5em" }} />
        {strings.checkingAnswer}
      </AnswerLine>
    );
  }
  if (!note) return null;

  if (note.kind === "nearMiss" && !isExerciseOver) {
    return <AnswerLine>{withBoldParts(strings.closeTryAgain, note.typed.trim())}</AnswerLine>;
  }

  // Once the exercise ends, what was typed is no longer on screen (the input
  // goes, the cloze blank shows the expected word), so the line says it.
  const lines = isTranslation
    ? { alternative: strings.alsoRightTranslation, nearMiss: strings.closeButTranslation }
    : { alternative: strings.alsoRightPractising, nearMiss: strings.understoodButPractising };
  return (
    <AnswerLine>
      {withBoldParts(lines[note.kind], note.typed.trim(), removePunctuation(expected))}
      {note.explanation && <> {note.explanation}</>}
    </AnswerLine>
  );
}

// A string with {0}, {1}, ... in it, those filled in bold. (The app's
// strings.formatString turns elements into "[object Object]".)
function withBoldParts(template, ...parts) {
  return template.split(/(\{\d\})/).map((piece, i) => {
    const placeholder = piece.match(/^\{(\d)\}$/);
    return placeholder ? <strong key={i}>{parts[placeholder[1]]}</strong> : piece;
  });
}

// One line under the sentence about an answer that was another word than the
// expected one. The FullWidth*Msg boxes are page-level messages, too heavy for
// a line inside the exercise card.
const AnswerLine = styled.p`
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.95em;
  max-width: 32em;
  margin: 1em auto 0 auto;
`;
