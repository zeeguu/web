import { useContext } from "react";

import { SystemLanguagesContext } from "../contexts/SystemLanguagesContext";
import FormSection from "../pages/_pages_shared/FormSection.sc";
import LanguageDialectSelector from "./LanguageDialectSelector";

/**
 * Which variety of the learned language is read aloud.
 *
 * Asked on its own step in onboarding and at the foot of Language Settings, and
 * kept out of LanguageChoiceFields on purpose: that form already asks four
 * questions, and a fifth put the button that leaves the page below the fold on a
 * phone.
 *
 * Most learners never see it. Only languages whose varieties have voices offer
 * one at all -- French has Belgian feeds and no Belgian voice -- so
 * `hasDialectQuestion` is false for nearly everyone and neither caller renders
 * anything.
 */
export function useDialectQuestion(learnedLanguage) {
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);

  const dialects = sortedSystemLanguages?.dialects?.[learnedLanguage] || [];

  return { dialects, hasDialectQuestion: dialects.length > 0 };
}

export default function LanguageDialectFields({ fields }) {
  const { dialects, hasDialectQuestion } = useDialectQuestion(fields.learnedLanguage);

  if (!hasDialectQuestion) return null;

  return (
    <FormSection>
      <LanguageDialectSelector
        dialects={dialects}
        selectedValue={fields.dialect}
        onChange={(value) => fields.setDialect(value)}
      />
    </FormSection>
  );
}
