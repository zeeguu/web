// Elements must be a list of {value:, label:} dictionaries
// e.g. const learnedLanguages = [
//     { value: 'en', label: 'English' },
//     { value: 'fr', label: 'French' },
//     { value: 'da', label: 'Danish' }
//   ]
import * as s from "../pages/info_page_shared/SelectOptions.sc";
export default function Select({
  elements,
  label,
  optionLabel,
  val,
  updateFunction,
  current,
  name,
  id,
}) {
  return (
    <s.SelectWrapper>
      <s.Label htmlFor={id} name={name}>
        {label}
      </s.Label>
      <s.SelectStyledContainer>
        <s.Select onChange={(e) => updateFunction(e.target.value)}>
          <option style={{ display: "none" }} />

          {elements.map((each) => (
            <option
              key={val(each)}
              value={val(each)}
              selected={current === val(each)}
            >
              {optionLabel(each)}
            </option>
          ))}
        </s.Select>
      </s.SelectStyledContainer>
    </s.SelectWrapper>
  );
}
