import Infobox from "../components/Infobox";

export default function InfoBoxZeeguuWordSelection({
  totalWordsSelectedByZeeguu,
  totalWordsTranslated,
  showExplainWordSelectionModal,
  setShowExplainWordSelectionModal,
  ToggleEditModeComponent,
}) {
  return (
    <Infobox>
      <div>
        <p>
          We have selected{" "}
          <b>
            {totalWordsSelectedByZeeguu} out of {totalWordsTranslated}{" "}
            translated words for you to practice.{" "}
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
        {ToggleEditModeComponent}
      </div>
    </Infobox>
  );
}
