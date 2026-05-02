import strings from "../../i18n/definitions";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function WordBreakdown({ wordMatches }) {
  if (!wordMatches || wordMatches.length === 0) return null;

  return (
    <s.WordBreakdown>
      <h5>{strings.verbalFlashcardsWordBreakdown}</h5>
      <s.WordList>
        {wordMatches.map((match, idx) => (
          <s.WordItem key={idx} $isCorrect={match.isCorrect}>
            <s.WordText>{match.word}</s.WordText>
            <s.WordPosition>{match.position + 1}</s.WordPosition>
            <s.WordStatus>{match.isCorrect ? "✓" : "✗"}</s.WordStatus>
            {match.suggestedWord && !match.isCorrect && <s.WordSuggestion>→ {match.suggestedWord}</s.WordSuggestion>}
          </s.WordItem>
        ))}
      </s.WordList>
    </s.WordBreakdown>
  );
}
