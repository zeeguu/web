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
      {options?.map((option) => (
        <s.StyledDiv key={option.id}>
          <s.StyledInput
            type="radio"
            id={option.id}
            name={name}
            value={option.language}
            checked={selectedValue === option.language}
            onChange={onChange}
          />
          <s.StyledLabel htmlFor={option.language}>
            {option.language}
          </s.StyledLabel>
        </s.StyledDiv>
      ))}
    </s.StyledFieldset>
  );
}
