import { useState } from "react";
import DynamicFlagImage from "../components/DynamicFlagImage";
import EmptyState from "../components/EmptyState";
import useGuardedLanguageSwitch from "../hooks/useGuardedLanguageSwitch";
import { languageName } from "../utils/misc/languageCodeToName";
import * as s from "./ClassroomOtherLanguages.sc";

/**
 * Turns the student's classes into one row per (class, language) they could
 * switch to. A class whose texts are all in the language already being learned
 * is dropped: the feed would not be empty if it had anything to offer.
 */
export function otherLanguageOptions(cohorts, learnedLanguage) {
  return (cohorts || []).flatMap((cohort) =>
    (cohort.texts_by_language || [])
      .filter((each) => each.code !== learnedLanguage && each.count > 0)
      .map((each) => ({
        key: `${cohort.id}-${each.code}`,
        cohortName: cohort.name,
        languageCode: each.code,
        count: each.count,
      })),
  );
}

/**
 * Shown when the classroom comes up empty because the student is learning a
 * language their class does not teach — the single most common reason for an
 * empty classroom (roughly one membership in five). The old message just said
 * there were no articles, which reads as "your teacher shared nothing" and
 * leaves no way forward.
 *
 * Switching is safe to offer this casually, and safe to describe as reversible:
 * user_language keeps the level, streak and scheduled words of every language
 * separately, so nothing is lost by going back and forth.
 */
export default function ClassroomOtherLanguages({ options, learnedLanguage }) {
  const { requestSwitch, confirmModal } = useGuardedLanguageSwitch();
  const [switchingTo, setSwitchingTo] = useState(null);

  // An account can reach here with no learned language at all (the API sends
  // null for it). "Switch back any time" is the wrong promise for someone who
  // has not chosen a first language yet, so both the heading and the buttons
  // change verb.
  const hasLearnedLanguage = Boolean(learnedLanguage);
  const title = hasLearnedLanguage
    ? `Nothing here in ${languageName(learnedLanguage)}`
    : "Choose a language to start reading";
  const message = hasLearnedLanguage
    ? "There are texts in your classes, just not in the language you are learning right now. You can switch back any time."
    : "There are texts in your classes. Pick the language you want to read in.";

  return (
    <EmptyState title={title} message={message}>
      {confirmModal}
      <s.ClassList>
        {options.map((option) => (
          <s.ClassRow key={option.key}>
            <div>
              <s.ClassName>{option.cohortName}</s.ClassName>
              <s.TextCount>
                <DynamicFlagImage languageCode={option.languageCode} size={"1rem"} />
                {option.count} {option.count === 1 ? "text" : "texts"} in{" "}
                {languageName(option.languageCode)}
              </s.TextCount>
            </div>
            <s.SwitchButton
              type="button"
              disabled={switchingTo !== null}
              onClick={() => {
                setSwitchingTo(option.key);
                requestSwitch(option.languageCode, () => setSwitchingTo(null));
              }}
            >
              {switchingTo === option.key
                ? "Switching..."
                : hasLearnedLanguage
                  ? `Switch to ${languageName(option.languageCode)}`
                  : `Read in ${languageName(option.languageCode)}`}
            </s.SwitchButton>
          </s.ClassRow>
        ))}
      </s.ClassList>
    </EmptyState>
  );
}
