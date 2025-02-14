import * as s from "./RadioGroup.sc";

export default function RadioGroup({
  legend,
  name,
  options,
  selectedValue,
  onChange,
  optionLabel,
  optionValue,
  optionId,
}) {
  return (
    <s.StyledFieldset>
      <s.StyledLegend id={`${name}-label`}>{legend}</s.StyledLegend>
      {options?.map((option) => (
        <>
          <s.StyledInput
            key={optionId(option)}
            type="radio"
            id={optionId(option)}
            name={name}
            value={optionValue(option)}
            onChange={onChange}
            checked={selectedValue === optionValue(option)}
          />
          <s.StyledLabel htmlFor={optionId(option)}>
            {optionLabel(option)}
          </s.StyledLabel>
        </>
      ))}
    </s.StyledFieldset>
  );
}
