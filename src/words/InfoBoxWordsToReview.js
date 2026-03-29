import Infobox from "../components/Infobox";

export default function InfoBoxWordsToReview({
  hasNoWordsTranslated,
  hasUserTranslatedWords,
  totalWordsTranslated,
  wordsForExercisesCount,
  toggleEditWordsComponent,
}) {
  const UserTranslatedWords = (
    <>
      <p>
        <b>
          You translated {totalWordsTranslated} {totalWordsTranslated === 1 ? "word" : "words"}.{" "}
          {wordsForExercisesCount > 0 &&
            (wordsForExercisesCount === totalWordsTranslated
              ? "They will eventually appear in your exercises."
              : `${wordsForExercisesCount} will eventually appear in your exercises.`)}
        </b>
      </p>
      <p>Use the toggle to exclude words you don't want to practice.</p>
    </>
  );
  const NoWordsTranslated = (
    <>
      <p>
        <b>You haven't translated any words yet.</b>
      </p>
      <p>Use the toggle to exclude words you don't want to practice.</p>
    </>
  );

  return (
    <Infobox>
      <div>
        {hasUserTranslatedWords && UserTranslatedWords}
        {hasNoWordsTranslated && NoWordsTranslated}
        {toggleEditWordsComponent}
      </div>
    </Infobox>
  );
}
