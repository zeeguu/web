import * as s from "./TextField.sc";

export default function TextField({
  onChange,
  label, // label above the field
  placeholder,
  name,
  id,
  autoFocus,
  multiline = false,
  rows = 2,
}) {
  return (
    <s.TextFieldWrapper>
      <s.Label htmlFor={id} name={label}>
        {label}
      </s.Label>
      <s.TextFieldContainer>
        <s.StyledTextField
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          multiline={multiline}
          rows={multiline ? rows : undefined}
        ></s.StyledTextField>
      </s.TextFieldContainer>
    </s.TextFieldWrapper>
  );
}
