export function LanguageSelector ({ languages, selected, onChange }) {
  return (
    <select
      name='learned_language'
      value={selected}
      onChange={e => onChange(e)}
    >
      {languages.map(lang => (
        <option key={lang.code} code={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}
