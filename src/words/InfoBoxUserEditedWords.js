import Infobox from "../components/Infobox";

export default function InfoBoxUserEditedWords({
  totalWordsForExercises,
  totalWordsTranslated,
  ToggleEditModeComponent,
}) {
  return (
    <Infobox>
      <div>
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
        {ToggleEditModeComponent}
      </div>
    </Infobox>
  );
}
