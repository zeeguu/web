import * as s from "./RadioGroup.sc";

export default function RadioGroup({
  legend,
  name,
  options,
  selectedValue,
  onChange,
}) {
  return (
    <s.StyledFieldset>
      <s.StyledLegend id={`${name}-label`}>{legend}</s.StyledLegend>
      {options.map((option) => (
        <s.StyledDiv key={option.value}>
          <s.StyledInput
            type="radio"
            id={option.value}
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
          />
          <s.StyledLabel htmlFor={option.value}>{option.label}</s.StyledLabel>
        </s.StyledDiv>
      ))}
    </s.StyledFieldset>
  );
}
