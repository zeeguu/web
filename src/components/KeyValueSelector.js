// Elements must be a list of {value:, label:} dictionaries
// e.g. const learnedLanguages = [
//     { value: 'en', label: 'English' },
//     { value: 'fr', label: 'French' },
//     { value: 'da', label: 'Danish' }
//   ]

//onChange in KeyValueSelector takes and evokes custom updateFunction

import * as s from "./SelectorStyling.sc";

export default function KeyValueSelector({
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
        <s.Select
          value={current}
          onChange={(e) => updateFunction(e.target.value)}
        >
          <option style={{ display: "none" }} />

          {elements.map((each) => (
            <option key={val(each)} value={val(each)}>
              {optionLabel(each)}
            </option>
          ))}
        </s.Select>
      </s.SelectStyledContainer>
    </s.SelectWrapper>
  );
}
