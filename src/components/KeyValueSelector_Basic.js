// Elements must be a list of {value:, label:} dictionaries
// e.g. const learnedLanguages = [
//     { value: 'en', label: 'English' },
//     { value: 'fr', label: 'French' },
//     { value: 'da', label: 'Danish' }
//   ]

//onChange in KeyValueSelector_Basic takes and evokes standard react event handler

import * as s from "./SelectorStyling.sc";

export default function KeyValueSelector_Basic({
  value,
  label,
  placeholder,
  options,
  optionLabel,
  optionValue,
  onChangeHandler,
  id,
  name,
}) {
  return (
    <s.SelectWrapper>
      <s.Label htmlFor={id} name={name}>
        {label}
      </s.Label>
      <s.SelectStyledContainer>
        <s.Select id={id} onChange={onChangeHandler} value={value}>
          <option value={""} disabled>
            {placeholder}
          </option>

          {options?.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>
              {optionLabel(option)}
            </option>
          ))}
        </s.Select>
      </s.SelectStyledContainer>
    </s.SelectWrapper>
  );
}
