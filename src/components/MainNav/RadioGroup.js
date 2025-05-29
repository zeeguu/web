import * as s from "./RadioGroup.sc";

export default function RadioGroup({
  radioGroupLabel,
  ariaLabel,
  name,
  options,
  selectedValue,
  onChange,
  optionLabel,
  optionValue,
  optionId,
  dynamicIcon,
  radiosContentLeftAligned = false,
}) {
  return (
    <s.StyledRadioGroup role="radiogroup" aria-label={ariaLabel} aria-labelledby={radioGroupLabel && `${name}-label`}>
      <s.RadioGroupLabel id={`${name}-label`}>{radioGroupLabel}</s.RadioGroupLabel>
      {options?.map((option) => (
        <div key={optionId(option)}>
          <s.StyledInput
            type="radio"
            id={optionId(option)}
            name={name}
            value={optionValue(option)}
            onChange={onChange}
            checked={selectedValue === optionValue(option)}
          />
          <s.OptionLabel htmlFor={optionId(option)} $leftAligned={radiosContentLeftAligned}>
            {dynamicIcon && dynamicIcon(option)}
            {optionLabel(option)}
          </s.OptionLabel>
        </div>
      ))}
    </s.StyledRadioGroup>
  );
}
