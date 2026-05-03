import ReplayIcon from "@mui/icons-material/Replay";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import strings from "../../i18n/definitions";
import ActionButton from "../../components/ActionButton";
import { StyledButton } from "../../components/allButtons.sc";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function CardNavigator({
  canGoNext,
  canGoPrevious,
  nextCard,
  prevCard,
  repeatCard,
  shuffleCards,
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

      <s.IconControls>
        <ActionButton
          variant="muted"
          onClick={shuffleCards}
          title={strings.verbalFlashcardsShuffleCards}
          aria-label={strings.verbalFlashcardsShuffleCards}
        >
          <ShuffleIcon fontSize="small" />
        </ActionButton>
        <ActionButton
          variant="muted"
          onClick={repeatCard}
          title={strings.verbalFlashcardsRepeatThisCard}
          aria-label={strings.verbalFlashcardsRepeatThisCard}
        >
          <ReplayIcon fontSize="small" />
        </ActionButton>
      </s.IconControls>
    </s.CardControls>
  );
}
