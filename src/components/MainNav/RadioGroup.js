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
        <s.StyledDiv key={optionId(option)}>
          <s.StyledInput
            type="radio"
            id={optionId(option)}
            name={name}
            value={optionValue(option)}
            checked={selectedValue === optionValue(option)}
            onChange={onChange}
          />
          <s.StyledLabel htmlFor={optionId(option)}>
            {optionLabel(option)}
          </s.StyledLabel>
        </s.StyledDiv>
      ))}
    </s.StyledFieldset>
  );
}
