import strings from "../i18n/definitions";

export const CEFR_LEVELS = [
  { value: "1", label: "A1 | " + strings.beginner, description: strings.beginnerDescription },
  { value: "2", label: "A2 | " + strings.elementary, description: strings.elementaryDescription },
  { value: "3", label: "B1 | " + strings.intermediate, description: strings.intermediateDescription },
  { value: "4", label: "B2 | " + strings.upperIntermediate, description: strings.upperIntermediateDescription },
  { value: "5", label: "C1 | " + strings.advanced, description: strings.advancedDescription },
  { value: "6", label: "C2 | " + strings.proficiency, description: strings.proficiencyDescription },
];

// "A2" -> "2", the CEFR_LEVELS value; "" for anything else.
export function levelValueFromCefr(code) {
  const index = ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(code);
  return index === -1 ? "" : String(index + 1);
}
