import { useContext } from "react";

import { SystemLanguagesContext } from "../contexts/SystemLanguagesContext";
import LanguageVarietySelector from "./LanguageVarietySelector";
import LanguageDialectSelector from "./LanguageDialectSelector";

/**
 * The two country questions about the learned language: where its news comes
 * from, and which variety of it is read aloud.
 *
 * Kept out of LanguageChoiceFields and asked together, in both places they are
 * asked -- their own onboarding step, and the foot of Language Settings. Apart,
 * two rows of country pills read as the same question asked twice; together, the
 * labels do the explaining.
 *
 * Most learners see neither. Only a handful of languages divide along national
 * lines, and only some of those have a voice for more than one variety, so
 * `hasCountryQuestions` is false for nearly everyone and neither caller renders
 * anything.
 */
export function useCountryQuestions(learnedLanguage) {
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);

  const varieties = sortedSystemLanguages?.varieties?.[learnedLanguage] || [];
  const dialects = sortedSystemLanguages?.dialects?.[learnedLanguage] || [];

  return { varieties, dialects, hasCountryQuestions: varieties.length > 0 || dialects.length > 0 };
}

export default function LanguageCountryFields({ fields }) {
  const { varieties, dialects, hasCountryQuestions } = useCountryQuestions(fields.learnedLanguage);

  if (!hasCountryQuestions) return null;

  return (
    <>
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
    </>
  );
}
