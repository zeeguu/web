import strings from "../i18n/definitions";
import PillSelector from "./PillSelector";
import { flagFor, localisedCountryName } from "./LanguageVarietySelector";
import { effectiveDialect } from "../utils/misc/languageVariety";

/**
 * Which variety of their language the learner is studying, as pills.
 *
 * The sibling of LanguageVarietySelector and deliberately not the same control.
 * That one asks where the news comes from, where "Everywhere" is a coherent
 * answer; this one has no such option, because there is no being read to in no
 * particular accent. It also offers a shorter list: only varieties a voice
 * actually exists for, which the API decides -- French has Belgian feeds and no
 * Belgian voice, so a French learner is never shown this control at all.
 *
 * The label names the audio lesson rather than the dialect in the abstract. The
 * lesson's voice is the only thing that honours this preference today; the
 * translator's target and the wording of generated text are meant to read it
 * too, and the label widens when they do. Promising that now would be promising
 * something a learner cannot yet hear.
 *
 * It is phrased as the learner speaking -- "I want audio lessons spoken in" --
 * like every other label on the form. Beyond consistency, the first person is
 * what separates this from the control above it: "I want news from Belgium" and
 * "I want audio lessons spoken in Belgium" cannot be read as the same question,
 * where two impersonal labels over two rows of country pills still can.
 */
export default function LanguageDialectSelector({ dialects, selectedValue, onChange }) {
  const effectiveValue = effectiveDialect(dialects, selectedValue);

  const options = dialects.map((dialect) => ({
    value: dialect.country,
    pillLabel: `${flagFor(dialect.country)} ${localisedCountryName(dialect.country)}`.trim(),
    // "Belgian Dutch" -- the API's own wording. In the tooltip rather than on
    // screen, where it would only restate the pill it sits under.
    title: dialect.name,
  }));

  return (
    <PillSelector
      id={"language-dialect-selector"}
      equalWidth={false}
      options={options}
      selectedValue={effectiveValue}
      onChange={onChange}
      label={strings.audioLessonsSpokenIn}
    />
  );
}
