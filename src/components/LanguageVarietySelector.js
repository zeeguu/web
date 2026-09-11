import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import { languageName } from "../utils/misc/languageCodeToName";
import PillSelector from "./PillSelector";

/**
 * Where a learner wants their news from, as pills: there are only ever a few, and
 * seeing all of them is how someone learns the choice exists.
 *
 * Named for the feed because that is all it does. "All" is a coherent answer to
 * "which sources?" and an incoherent one to "which variety are you learning?" --
 * and the voice and translation target, when they read this preference, will want
 * a control of their own with exactly two options and no "All", since there is no
 * such thing as speaking in no particular accent.
 *
 * The pill is the country alone -- "Belgium" -- because a row of them has to fit
 * a phone, and the line underneath carries the full name the API gave us
 * ("Belgian Dutch"). The country name comes from Intl rather than from us: the
 * browser already knows it, in the reader's own language, and inventing a second
 * list of country names next to the API's would be a list to keep in sync.
 */
/**
 * The flag for a country code, built from its letters as regional indicators --
 * no asset to add for every new country in the catalogue. Windows has no flag
 * glyphs and falls back to showing the two letters, which sits fine next to the
 * name it precedes.
 */
function flagFor(country) {
  // Only two uppercase letters map into the regional-indicator block; anything
  // else would offset into unrelated code points and render as garbage next to
  // a perfectly good country name.
  if (!/^[A-Z]{2}$/.test(country)) return "";
  return country.replace(/./g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));
}

/**
 * The language's name in the reader's own language. LANGUAGE_CODE_TO_NAME is
 * English only, but its lowercased value is the i18n key for the translated one
 * -- the same route LanguageSelector takes for its options.
 */
function translatedLanguageName(languageCode) {
  const english = languageName(languageCode);
  return strings[english.toLowerCase()] || english;
}

export function localisedCountryName(country) {
  try {
    // getUiLanguage returns the whole language object, not a code.
    const uiLanguage = LocalStorage.getUiLanguage()?.code || "en";
    return new Intl.DisplayNames([uiLanguage], { type: "region" }).of(country) || country;
  } catch (e) {
    // Intl.DisplayNames is missing or the code is not a region it knows.
    return country;
  }
}

export default function LanguageVarietySelector({ varieties, selectedValue, onChange, languageCode }) {
  const options = [
    { value: "", pillLabel: strings.allNewsFeedSources },
    ...varieties.map((variety) => ({
      value: variety.country,
      pillLabel: `${flagFor(variety.country)} ${localisedCountryName(variety.country)}`.trim(),
      // variety.name ("Belgian Dutch") is the API's own wording, kept for the
      // tooltip and for the prompts and voices that will consume it server-side.
      // On screen it would only restate the pill it sits under.
      title: variety.name,
    })),
  ];

  return (
    <PillSelector
      id={"language-variety-selector"}
      equalWidth={false}
      options={options}
      selectedValue={selectedValue}
      onChange={onChange}
      // "News in Dutch from Belgium", not "Dutch news from Belgium": in English
      // the language and the demonym are the same word, so the short form reads
      // as news OF the Netherlands from Belgium -- and in French, where it would
      // say news of France from Belgium, the contradiction is louder still.
      label={strings.formatString(strings.newsFeedSources, translatedLanguageName(languageCode))}
    />
  );
}
