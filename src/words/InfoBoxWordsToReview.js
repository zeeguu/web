import Infobox from "../components/Infobox";

export default function InfoBoxWordsToReview({
  hasZeeguuSelectWords,
  hasUserEditedWords,
  hasNoWordsSelected,
  wordsForExercises_Counter,
  wordsSelectedByZeeguu_Counter,
  totalWordsTranslated,
  showExplainWordSelectionModal,
  setShowExplainWordSelectionModal,
  toggleEditWordsComponent,
}) {
  const ZeeguuSelectedWords = (
    <>
      <p>
        We have selected{" "}
        <b>
          {wordsSelectedByZeeguu_Counter} out of {totalWordsTranslated} translated words for you to practice.{" "}
        </b>
        <span
          className="link-style"
          onClick={() => {
            setShowExplainWordSelectionModal(!showExplainWordSelectionModal);
          }}
        >
          Tell me why these words are selected
        </span>
        .
      </p>
      <p>
        <b>Try using the toggle below to add or remove words.</b>
      </p>
    </>
  );

  const UserEditedWords = (
    <>
      <p>
        <b>You have edited the words for this article.</b>
      </p>
      <p>
        <b>
          {wordsForExercises_Counter} out of {totalWordsTranslated}{" "}
        </b>
        translated words will be used in exercises.{" "}
      </p>
      <p>
        <b>Try using the toggle below to add or remove words.</b>
      </p>
    </>
  );

  const NoWordsSelected = (
    <>
      <p>
        <b>No words available for exercises.</b>
      </p>
      {<p>Words may be unavailable if already learned or unsuitable for exercises.</p>}
      <p>
        <b>Try using the toggle below to add or remove words.</b>
      </p>
    </>
  );

  return (
    <Infobox>
      <div>
        {hasZeeguuSelectWords && ZeeguuSelectedWords}
        {hasUserEditedWords && UserEditedWords}
        {hasNoWordsSelected && NoWordsSelected}
        {toggleEditWordsComponent}
      </div>
    </Infobox>
  );
}
