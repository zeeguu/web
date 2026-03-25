import Infobox from "../components/Infobox";

export default function InfoBoxWordsToReview({
  hasNoWordsTranslated,
  hasUserTranslatedWords,
  totalWordsTranslated,
  toggleEditWordsComponent,
}) {
  const UserTranslatedWords = (
    <>
      <p>
        <b>
          You have translated {totalWordsTranslated} {totalWordsTranslated === 1 ? "word" : "words"}.
        </b>
      </p>
      <p>Try using the toggle below to add or remove words.</p>
    </>
  );
  const NoWordsTranslated = (
    <>
      <p>
        <b>You haven't translated any words yet.</b>
      </p>
      <p>Try using the toggle below to add or remove words.</p>
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
