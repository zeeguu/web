import * as s from "./RadioGroup.sc";

// Shared single-choice control, in two variants:
//
//  - "pill" (default): a wrapping row of compact chips, for short labels that
//    read well side by side — e.g. the language picker in MainNav.
//  - "card": a full-width stacked list where each row carries a label and an
//    optional description, for settings pages. The description is inside the
//    <label>, so the whole row is one tap target rather than a 20px dot.
//
// Both variants hide the native radio and make the <label> itself the selected
// surface, styled with the app's CSS variables. That is what keeps them
// readable in dark mode: an MUI <Radio/> would fall back to MUI's default light
// palette (this app defines no MUI theme) and render near-black on near-black.
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
  optionDescription,
  dynamicIcon,
  radiosContentLeftAligned = false,
  variant = "pill",
}) {
  const isCard = variant === "card";

  function renderOption(option) {
    const value = optionValue(option);
    const id = optionId(option);
    const isSelected = selectedValue === value;
    const description = optionDescription && optionDescription(option);

    const pillContent = optionLabel(option);
    const cardContent = (
      <>
        <s.CardText>
          <s.CardLabel>{optionLabel(option)}</s.CardLabel>
          {description && <s.CardDescription>{description}</s.CardDescription>}
        </s.CardText>
        {isSelected && <s.CardCheck aria-hidden="true">✓</s.CardCheck>}
      </>
    );

    return (
      <s.OptionRow key={id} $variant={variant}>
        <s.StyledInput type="radio" id={id} name={name} value={value} onChange={onChange} checked={isSelected} />
        <s.OptionLabel htmlFor={id} $leftAligned={radiosContentLeftAligned} $variant={variant}>
          {dynamicIcon && dynamicIcon(option)}
          {isCard ? cardContent : pillContent}
        </s.OptionLabel>
      </s.OptionRow>
    );
  }

  return (
    <s.StyledRadioGroup
      role="radiogroup"
      $variant={variant}
      aria-label={ariaLabel}
      aria-labelledby={radioGroupLabel && `${name}-label`}
    >
      {radioGroupLabel && <s.RadioGroupLabel id={`${name}-label`}>{radioGroupLabel}</s.RadioGroupLabel>}
      {options?.map(renderOption)}
    </s.StyledRadioGroup>
  );
}
