import strings from "../i18n/definitions";

export default function UiLanguageSelector({ languages, selected, onChange }) {
  return (
    <select
      name="learned_language"
      value={strings[selected.toLowerCase()]}
      onChange={(e) => onChange(e)}
    >
      {languages.map((lang) => (
        <option key={lang.code} code={lang.code}>
          {strings[lang.name.toLowerCase()]}
        </option>
      ))}
    </select>
  );
}
