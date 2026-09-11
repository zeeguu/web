import { useContext } from "react";

import { SystemLanguagesContext } from "../contexts/SystemLanguagesContext";
import { CEFR_LEVELS } from "../assorted/cefrLevels";
import strings from "../i18n/definitions";
import FormSection from "../pages/_pages_shared/FormSection.sc";
import CefrLevelSelector from "./CefrLevelSelector";
import LanguageSelector from "./LanguageSelector";
import LanguageVarietySelector from "./LanguageVarietySelector";
import LanguageDialectSelector from "./LanguageDialectSelector";

/**
 * Learned language + level + translation language, asked the same way wherever
 * they are asked, in three groups: what is being learned and how well, then what
 * translations arrive in, and last the country questions -- last because they are
 * the only ones that come and go, and a section appearing mid-form would shift
 * everything below it each time the learned language changed. Pair it with useLanguageChoiceFields, which owns the state and
 * the validation; this renders the answers and nothing else, so each screen keeps
 * its own chrome (title, buttons) and its own way of saving.
 */
export default function LanguageChoiceFields({ fields }) {
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

  // Directly beneath the one above, and that adjacency is the point: two rows of
  // country pills, one asking where the news comes from and one which variety is
  // read aloud. Apart they look like the same question asked twice; together the
  // labels do the explaining.
  const dialects = sortedSystemLanguages.dialects?.[fields.learnedLanguage] || [];

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

      {/* Last, because it is the only section that comes and goes. Only a handful
          of languages divide along national lines, so for most learners this is
          absent entirely -- and a block that appears and disappears in the middle
          of the form would move everything under it each time the learned language
          changed. The questions above keep their positions whatever is chosen.

          The two belong beside each other: apart, two rows of country pills read
          as the same question asked twice, and together the labels do the
          explaining. */}
      {(varieties.length > 0 || dialects.length > 0) && (
        <FormSection>
          {varieties.length > 0 && (
            <LanguageVarietySelector
              varieties={varieties}
              selectedValue={fields.variety}
              onChange={(value) => fields.setVariety(value)}
            />
          )}

          {dialects.length > 0 && (
            <LanguageDialectSelector
              dialects={dialects}
              selectedValue={fields.dialect}
              onChange={(value) => fields.setDialect(value)}
            />
          )}
        </FormSection>
      )}
    </>
  );
}
