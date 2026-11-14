import strings from "../i18n/definitions";
import { toNumber } from "../utils/misc/cefr";

// The levels a learner can choose for themselves. "0" is A0, for someone who has
// never learned the language: their audio lessons start from zero, and they read
// the easiest texts there are (A1), since nothing is written below A1.
export const CEFR_LEVELS = [
  { value: "0", label: "A0 | " + strings.knowsNothing, description: strings.knowsNothingDescription },
  { value: "1", label: "A1 | " + strings.beginner, description: strings.beginnerDescription },
  { value: "2", label: "A2 | " + strings.elementary, description: strings.elementaryDescription },
  { value: "3", label: "B1 | " + strings.intermediate, description: strings.intermediateDescription },
  { value: "4", label: "B2 | " + strings.upperIntermediate, description: strings.upperIntermediateDescription },
  { value: "5", label: "C1 | " + strings.advanced, description: strings.advancedDescription },
  { value: "6", label: "C2 | " + strings.proficiency, description: strings.proficiencyDescription },
];

// "A2" -> "2", the CEFR_LEVELS value; "" for anything else.
export function levelValueFromCefr(code) {
  const number = toNumber(code);
  return number === null ? "" : String(number);
}
