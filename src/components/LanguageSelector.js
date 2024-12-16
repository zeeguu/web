import strings from "../i18n/definitions";
import Selector from "./Selector";

export default function LanguageSelector({
  languages,
  selected,
  onChange,
  errorMessage,
  isError,
  label,
  id,
}) {
  // Sorting in place
  languages.sort((a, b) => (a.name > b.name ? 1 : -1));

  function languageLabel(language) {
    return strings[language.name.toLowerCase()];
  }

  function languageCode(language) {
    return language.code;
  }

  return (
    <Selector
      options={languages}
      optionLabel={languageLabel}
      optionValue={languageCode}
      selectedValue={selected}
      onChange={onChange}
      label={label}
      placeholder={"Select language"}
      errorMessage={errorMessage}
      isError={isError}
      id={id}
    />
  );
}
