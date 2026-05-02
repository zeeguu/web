import strings from "../../i18n/definitions";
import Selector from "../../components/Selector";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

const NOISE_SENSITIVITY_OPTIONS = [
  { value: "0.03", label: strings.verbalFlashcardsLowNoise },
  { value: "0.08", label: strings.verbalFlashcardsMediumNoise },
  { value: "0.11", label: strings.verbalFlashcardsHighNoise },
];

export default function FlashcardsHeader({
  currentCardIndex,
  currentStreak,
  flashcardsCount,
  noiseSensitivity,
  setNoiseSensitivity,
  totalScore,
}) {
  return (
    <s.HeaderSection>
      <s.TitleSection>
        <s.TitleContainer>
          <h2>{strings.verbalFlashcardsTitle}</h2>
        </s.TitleContainer>
        <s.FiltersContainer>
          <Selector
            id="verbal-flashcards-noise-sensitivity"
            options={NOISE_SENSITIVITY_OPTIONS}
            optionLabel={(option) => option.label}
            optionValue={(option) => option.value}
            selectedValue={noiseSensitivity}
            onChange={(e) => setNoiseSensitivity(e.target.value)}
            placeholder={strings.verbalFlashcardsMediumNoise}
          />
        </s.FiltersContainer>
      </s.TitleSection>

      <s.StatsContainer>
        <s.StatItem>
          <s.StatLabel>{strings.verbalFlashcardsProgress}</s.StatLabel>
          <s.StatValue>{`${flashcardsCount > 0 ? currentCardIndex + 1 : 0}/${flashcardsCount}`}</s.StatValue>
        </s.StatItem>
        <s.StatItem>
          <s.StatLabel>{strings.verbalFlashcardsScore}</s.StatLabel>
          <s.StatValue>{Math.round(totalScore)}</s.StatValue>
        </s.StatItem>
        <s.StatItem>
          <s.StatLabel>{strings.verbalFlashcardsStreak}</s.StatLabel>
          <s.StatValue $isStreak={currentStreak > 0}>{currentStreak}</s.StatValue>
        </s.StatItem>
      </s.StatsContainer>
    </s.HeaderSection>
  );
}
