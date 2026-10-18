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
export default function AnswerNote({ isChecking, note, expected, isTranslation = false }) {
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

  const explanation = note.explanation && <> {note.explanation}</>;
  if (isTranslation) {
    // The input is gone once the exercise ends, so say what was typed.
    const line = note.kind === "alternative" ? strings.alsoRightTranslation : strings.closeButTranslation;
    return (
      <AnswerLine>
        {strings.formatString(line, <strong>{note.typed.trim()}</strong>, <strong>{removePunctuation(expected)}</strong>)}
        {explanation}
      </AnswerLine>
    );
  }

  const lead = note.kind === "alternative" ? strings.alsoRightPractising : strings.understoodButPractising;
  return (
    <AnswerLine>
      {lead} <strong>{removePunctuation(expected)}</strong>.{explanation}
    </AnswerLine>
  );
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
