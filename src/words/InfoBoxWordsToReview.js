import Infobox from "../components/Infobox";

export default function InfoBoxWordsToReview({
  isZeeguuSelectWords,
  isUserEditedWords,
  isNoWordsSelected,
  totalWordsForExercises,
  totalWordsSelectedByZeeguu,
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
          {totalWordsSelectedByZeeguu} out of {totalWordsTranslated} translated
          words for you to practice.{" "}
        </b>
        <a
          onClick={() => {
            setShowExplainWordSelectionModal(!showExplainWordSelectionModal);
          }}
        >
          Tell me why these words are selected
        </a>
        .
      </p>
      <p>
        <b>To manually add or remove words, use the toggle below.</b>
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
          {totalWordsForExercises} out of {totalWordsTranslated}{" "}
        </b>
        translated words will be used in exercises.{" "}
      </p>
      <p>
        <b>To manually add or remove words, use the toggle below.</b>
      </p>
    </>
  );

  const NoWordsSelected = (
    <>
      <p>
        <b>We are not able to schedule words for you.</b>
      </p>
      <p>
        This can happen when the words you translated can't be used in
        exercises, or because you have learned these words.
      </p>
      <p>
        <b>To manually add or remove words, use the toggle below.</b>
      </p>
    </>
  );

  return (
    <Infobox>
      <div>
        {isZeeguuSelectWords && ZeeguuSelectedWords}
        {isUserEditedWords && UserEditedWords}
        {isNoWordsSelected && NoWordsSelected}
        {toggleEditWordsComponent}
      </div>
    </Infobox>
  );
}
