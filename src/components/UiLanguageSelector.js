export default function UiLanguageSelector({ languages, selected, onChange }) {
  function capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }
  return (
    <select
      name="learned_language"
      value={selected}
      onChange={(e) => onChange(e)}
    >
      {languages.map((lang) => (
        <option key={lang.code} code={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
