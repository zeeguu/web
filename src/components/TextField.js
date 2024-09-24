import * as s from "./TextField.sc";

export default function TextField({
  onChange,
  label, // label above the field
  placeholder,
  name,
  id,
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
        ></s.StyledTextField>
      </s.TextFieldContainer>
    </s.TextFieldWrapper>
  );
}
