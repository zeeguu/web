import strings from "../../i18n/definitions";
import { StyledButton } from "../../components/allButtons.sc";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function CardNavigator({
  canGoNext,
  canGoPrevious,
  nextCardCountdown,
  nextCard,
  prevCard,
}) {
  const nextLabel =
    nextCardCountdown !== null
      ? `${strings.verbalFlashcardsNext} (${nextCardCountdown})`
      : strings.verbalFlashcardsNext;

  return (
    <s.CardControls>
      <s.CardNavigation>
        <StyledButton $navigation onClick={prevCard} disabled={!canGoPrevious} $disabled={!canGoPrevious}>
          {strings.verbalFlashcardsPrevious}
        </StyledButton>
        <StyledButton $navigation onClick={nextCard} disabled={!canGoNext} $disabled={!canGoNext}>
          {nextLabel}
        </StyledButton>
      </s.CardNavigation>
    </s.CardControls>
  );
}
