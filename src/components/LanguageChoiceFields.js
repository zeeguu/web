import { useContext } from "react";

import { SystemLanguagesContext } from "../contexts/SystemLanguagesContext";
import { CEFR_LEVELS } from "../assorted/cefrLevels";
import strings from "../i18n/definitions";
import FormSection from "../pages/_pages_shared/FormSection.sc";
import CefrLevelSelector from "./CefrLevelSelector";
import LanguageSelector from "./LanguageSelector";
import LanguageVarietySelector from "./LanguageVarietySelector";

/**
 * Learned language + level + translation language, asked the same way wherever
 * they are asked. Pair it with useLanguageChoiceFields, which owns the state and
 * the validation; this renders the answers and nothing else, so each screen keeps
 * its own chrome (title, buttons) and its own way of saving.
 */
export default function LanguageChoiceFields({ fields, dialectQuestion = null }) {
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);

  // A translation language that is also the learned language is not a choice
  // anyone means to make, so it is absent rather than rejected. The matching rule
  // in the hook stays as a backstop for a user who arrives already in that state.
  const translationLanguages = sortedSystemLanguages.native_languages.filter(
    (each) => each.code !== fields.learnedLanguage,
  );

  // Only a handful of languages divide along national lines, so for most people
  // this control is simply absent rather than a question with one sensible answer.
  const varieties = sortedSystemLanguages.varieties?.[fields.learnedLanguage] || [];

  return (
    <>
      <FormSection>
        <LanguageSelector
          id={"practiced-language-selector"}
          label={strings.learnedLanguage}
          languages={sortedSystemLanguages.learnable_languages}
          selected={fields.learnedLanguage}
          onChange={(e) => fields.setLearnedLanguage(e.target.value)}
          isError={!fields.isLearnedLanguageValid}
          errorMessage={fields.learnedLanguageError}
        />

        {varieties.length > 0 && (
          <LanguageVarietySelector
            varieties={varieties}
            selectedValue={fields.variety}
            onChange={(value) => fields.setVariety(value)}
          />
        )}

        {/* Which variety is read aloud, where a caller asks it here at all.
            Onboarding does not -- it has a step of its own for it, because five
            questions did not fit a phone -- and passes nothing. Settings does,
            and it belongs directly under the question above: apart, two rows of
            country pills read as the same question asked twice, and one of them
            stranded below the translation field reads as nothing at all. */}
        {dialectQuestion}

        <CefrLevelSelector
          levels={CEFR_LEVELS}
          label={strings.levelOfLearnedLanguage}
          selectedValue={fields.cefrLevel}
          onChange={(value) => fields.setCefrLevel(value)}
          isError={!fields.isCefrLevelValid}
          errorMessage={fields.cefrLevelError}
        />
      </FormSection>

      <FormSection>
        <LanguageSelector
          id={"translation-language-selector"}
          label={strings.baseLanguage}
          languages={translationLanguages}
          selected={fields.translationLanguage}
          onChange={(e) => fields.setTranslationLanguage(e.target.value)}
          isError={!fields.isTranslationLanguageValid}
          errorMessage={fields.translationLanguageError}
        />
      </FormSection>
    </>
  );
}
