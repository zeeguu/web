// Elements must be a list of {value:, label:} dictionaries
// e.g. const learnedLanguages = [
//     { value: 'en', label: 'English' },
//     { value: 'fr', label: 'French' },
//     { value: 'da', label: 'Danish' }
//   ]

//onChange in Selector takes and evokes standard react event handler

import * as s from "./Selector.sc";

export default function Selector({
  options, // objects that should include the value and the label
  optionLabel, // function for getting the label from an option object
  optionValue, // function for getting the value from an option object
  selectedValue, // current value - state in the parent component
  onChange,
  label, // label above the field
  placeholder,
  id,
}) {
  return (
    <s.SelectWrapper>
      <s.Label htmlFor={id} name={label}>
        {label}
      </s.Label>
      <s.SelectStyledContainer>
        <s.Select id={id} value={selectedValue} onChange={onChange}>
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
