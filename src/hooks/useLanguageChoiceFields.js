import { useState } from "react";

import useFormField from "./useFormField";
import useShadowRef from "./useShadowRef";
import validateRules from "../assorted/validateRules";
import { NonEmptyValidator, Validator } from "../utils/ValidatorRule/Validator";

/**
 * The three answers that decide what a learner reads and how it is translated:
 * the learned language, their level in it, and the language translations arrive in.
 *
 * Onboarding and Language Settings ask for exactly these, and each screen keeps
 * its own persistence -- onboarding mirrors them into LocalStorage and the
 * account-creation payload, settings PUTs them onto the user. What is shared is
 * the questions and their validation, so the two cannot drift apart again.
 *
 * The level is held as a CEFR_LEVELS value -- the strings "1".."6", which is what
 * CefrLevelSelector compares against. Callers that persist a number convert at
 * their own boundary.
 */
export default function useLanguageChoiceFields({
  learnedLanguage: initialLearnedLanguage = "",
  cefrLevel: initialCefrLevel = "",
  translationLanguage: initialTranslationLanguage = "en",
  variety: initialVariety = "",
  dialect: initialDialect = "",
  cefrLevelForLanguage,
  varietyForLanguage,
  dialectForLanguage,
} = {}) {
  const [learnedLanguage, setLearnedLanguage, validateLearnedLanguage, isLearnedLanguageValid, learnedLanguageError] =
    useFormField(initialLearnedLanguage, NonEmptyValidator("Please select a language."));

  const [cefrLevel, setCefrLevel, validateCefrLevel, isCefrLevelValid, cefrLevelError] = useFormField(
    initialCefrLevel,
    NonEmptyValidator("Please select a level for your learned language."),
  );

  // No preference is a real answer, so the variety needs no validator: "" is
  // what most learners will save, and what every existing row already holds.
  const [variety, setVariety] = useState(initialVariety);

  // Same shape, different question: which variety of the language is being
  // learned, as against which country's news to read. No validator for the same
  // reason -- "" is a real answer and the commonest one.
  const [dialect, setDialect] = useState(initialDialect);

  // useFormField captures its validators in state on the first render, so a rule
  // about *another* field has to read that field through a ref -- closing over
  // the render's value would pin it to whatever the learned language was then.
  const learnedLanguageRef = useShadowRef(learnedLanguage);

  const [
    translationLanguage,
    setTranslationLanguage,
    validateTranslationLanguage,
    isTranslationLanguageValid,
    translationLanguageError,
  ] = useFormField(initialTranslationLanguage, [
    NonEmptyValidator("Please select a language."),
    new Validator(
      (value) => value !== learnedLanguageRef.current,
      "Your Translation language needs to be different than your learned language.",
    ),
  ]);

  // A level belongs to a language, so a screen that already knows the user's
  // levels (settings does; onboarding has none yet) passes a lookup and the two
  // fields move together. Without it, choosing a new language would keep the
  // previous language's level on screen and then save it under the new one.
  function selectLearnedLanguage(code) {
    setLearnedLanguage(code);
    if (cefrLevelForLanguage) setCefrLevel(cefrLevelForLanguage(code));
    // A variety belongs to a language just as a level does: Belgian is an answer
    // about Dutch, and carrying it over to Portuguese would offer -- and save --
    // a variety that language does not have.
    setVariety(varietyForLanguage ? varietyForLanguage(code) : "");
    // Belongs to a language exactly as the variety does, and for the same
    // reason: Flemish is an answer about Dutch.
    setDialect(dialectForLanguage ? dialectForLanguage(code) : "");
  }

  function validate() {
    return validateRules([validateLearnedLanguage, validateCefrLevel, validateTranslationLanguage]);
  }

  return {
    learnedLanguage,
    setLearnedLanguage: selectLearnedLanguage,
    isLearnedLanguageValid,
    learnedLanguageError,

    cefrLevel,
    setCefrLevel,
    isCefrLevelValid,
    cefrLevelError,

    variety,
    setVariety,

    dialect,
    setDialect,

    translationLanguage,
    setTranslationLanguage,
    isTranslationLanguageValid,
    translationLanguageError,

    validate,
  };
}
