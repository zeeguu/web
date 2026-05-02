import strings from "../../i18n/definitions";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";
import CardNavigator from "./CardNavigator";
import FeedbackView from "./FeedbackView";
import FlashcardPrompt from "./FlashcardPrompt";
import RecordingControls from "./RecordingControls";

export default function FlashcardStage({
  accuracyResult,
  canGoNext,
  canGoPrevious,
  currentCard,
  flashcardsCount,
  isRecording,
  loading,
  nextCard,
  prevCard,
  repeatCard,
  showResult,
  shuffleCards,
  statusMessage,
  statusType,
  userSpeech,
}) {
  if (loading) {
    return (
      <s.LoadingState>
        <s.Spinner />
        <p>{strings.verbalFlashcardsLoading}</p>
      </s.LoadingState>
    );
  }

  if (flashcardsCount === 0) {
    return (
      <s.NoCardsMessage>
        <p>{strings.verbalFlashcardsNoCards}</p>
      </s.NoCardsMessage>
    );
  }

  if (!currentCard) return null;

  return (
    <>
      <FlashcardPrompt card={currentCard} />
      <RecordingControls isRecording={isRecording} statusMessage={statusMessage} statusType={statusType} />
      {showResult && <FeedbackView accuracyResult={accuracyResult} userSpeech={userSpeech} />}
      <CardNavigator
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        nextCard={nextCard}
        prevCard={prevCard}
        repeatCard={repeatCard}
        shuffleCards={shuffleCards}
      />
    </>
  );
}
