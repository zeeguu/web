// Elements must be a list of {value:, label:} dictionaries
// e.g. const learnedLanguages = [
//     { value: 'en', label: 'English' },
//     { value: 'fr', label: 'French' },
//     { value: 'da', label: 'Danish' }
//   ]

export default function Select({
  elements,
  label,
  val,
  updateFunction,
  current,
}) {
  return (
    <select onChange={(e) => updateFunction(e.target.value)}>
      <option style={{ display: "none" }} />

      {elements.map((each) => (
        <option
          key={val(each)}
          value={val(each)}
          selected={current === val(each)}
        >
          {label(each)}
        </option>
      ))}
    </select>
  );
}
