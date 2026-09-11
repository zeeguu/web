import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import PillSelector from "./PillSelector";

/**
 * Which regional variety of a language a learner wants, as pills: there are only
 * ever a few, and seeing all of them is how someone learns the choice exists.
 *
 * The pill is the country alone -- "Belgium" -- because a row of them has to fit
 * a phone, and the line underneath carries the full name the API gave us
 * ("Belgian Dutch"). The country name comes from Intl rather than from us: the
 * browser already knows it, in the reader's own language, and inventing a second
 * list of country names next to the API's would be a list to keep in sync.
 */
function countryName(country) {
  try {
    // getUiLanguage returns the whole language object, not a code.
    const uiLanguage = LocalStorage.getUiLanguage()?.code || "en";
    return new Intl.DisplayNames([uiLanguage], { type: "region" }).of(country) || country;
  } catch (e) {
    // Intl.DisplayNames is missing or the code is not a region it knows.
    return country;
  }
}

export default function LanguageVarietySelector({ varieties, selectedValue, onChange }) {
  const options = [
    {
      value: "",
      pillLabel: strings.anyLanguageVariety,
      hintDescription: strings.anyLanguageVarietyExplained,
    },
    ...varieties.map((variety) => ({
      value: variety.country,
      pillLabel: countryName(variety.country),
      hintLabel: variety.name,
    })),
  ];

  return (
    <PillSelector
      id={"language-variety-selector"}
      options={options}
      selectedValue={selectedValue}
      onChange={onChange}
      label={strings.languageVariety}
    />
  );
}
