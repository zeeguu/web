import strings from "../../i18n/definitions";
import { StyledButton } from "../../components/allButtons.sc";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function CardNavigator({
  canGoNext,
  canGoPrevious,
  nextCard,
  prevCard,
}) {
  return (
    <s.CardControls>
      <s.CardNavigation>
        <StyledButton $navigation onClick={prevCard} disabled={!canGoPrevious} $disabled={!canGoPrevious}>
          {strings.verbalFlashcardsPrevious}
        </StyledButton>
        <StyledButton $navigation onClick={nextCard} disabled={!canGoNext} $disabled={!canGoNext}>
          {strings.verbalFlashcardsNext}
        </StyledButton>
      </s.CardNavigation>
    </s.CardControls>
  );
}
