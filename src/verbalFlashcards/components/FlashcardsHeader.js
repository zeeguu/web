import strings from "../../i18n/definitions";
import Selector from "../../components/Selector";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function FlashcardsHeader({
  noiseSensitivity,
  noiseSensitivityNoticeVisible,
  progressCurrent,
  progressTotal,
  setNoiseSensitivity,
}) {
  const noiseSensitivityOptions = [
    { value: "0.03", label: strings.verbalFlashcardsLowNoise },
    { value: "0.08", label: strings.verbalFlashcardsMediumNoise },
    { value: "0.11", label: strings.verbalFlashcardsHighNoise },
  ];

  return (
    <s.HeaderSection>
      <s.TitleSection>
        <s.TitleContainer>
          <h2>{strings.verbalFlashcardsTitle}</h2>
        </s.TitleContainer>
        <s.FiltersContainer>
          <Selector
            id="verbal-flashcards-noise-sensitivity"
            options={noiseSensitivityOptions}
            optionLabel={(option) => option.label}
            optionValue={(option) => option.value}
            selectedValue={noiseSensitivity}
            onChange={(e) => setNoiseSensitivity(e.target.value)}
            showPlaceholder={false}
          />
          <s.SensitivityNotice $visible={noiseSensitivityNoticeVisible} aria-live="polite">
            {strings.verbalFlashcardsNoiseSensitivityUpdated}
          </s.SensitivityNotice>
        </s.FiltersContainer>
      </s.TitleSection>

      <s.StatsContainer>
        <s.ProgressSummary>
          <s.ProgressLabel>{strings.verbalFlashcardsProgress}</s.ProgressLabel>
          <s.ProgressValue>{`${progressCurrent}/${progressTotal}`}</s.ProgressValue>
        </s.ProgressSummary>
      </s.StatsContainer>
    </s.HeaderSection>
  );
}
