import * as s from "./SelectOptions.sc";

export default function SelectOptions({
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
