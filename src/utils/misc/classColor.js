import {
  tableau_1, tableau_3, tableau_5, tableau_6,
} from "../../components/colors";

// From the repo's categorical palette (matplotlib's tab10), the hues that stay
// legible as small text on both the cream and the dark ground. Dropped: grey
// (a class is never "the other one"), red (reads as an error), olive, pink and
// cyan (too pale at this size), orange (the app's own accent).
//
// Six classes is more than anyone here has; beyond that they repeat, which is
// honest -- the colour is a hint on top of the name, never the only signal.
const PALETTE = [
  tableau_1, // blue
  tableau_3, // green
  tableau_5, // purple
  tableau_6, // brown
  "#0f766e", // teal
  "#9a3412", // burnt orange
];

/**
 * A stable colour for a class.
 *
 * Keyed off the class's id rather than its position in a list, so a class keeps
 * its colour when the list is filtered, sorted, or a class is added — a colour
 * that reshuffles is worse than no colour, because you stop trusting it.
 */
export function classColor(cohortId) {
  const key = String(cohortId);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 1000003;
  }
  return PALETTE[hash % PALETTE.length];
}

/**
 * The pair a tinted chip needs: the hue for text and border, and a wash of it
 * for the fill. The wash is alpha over whatever is behind it, so one value
 * works on both the light and the dark ground.
 */
export function classColorTint(cohortId) {
  const hue = classColor(cohortId);
  return { hue, wash: `color-mix(in srgb, ${hue} 14%, transparent)` };
}
