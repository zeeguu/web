import * as s from "./InputField.sc";

export default function InputField({
  type,
  label,
  name,
  id,
  placeholder,
  onChange,
  value,
  helperText,
  error,
}) {
  return (
    <s.InputFieldWrapper>
      <s.Label htmlFor={id}>{label}</s.Label>
      <s.Input
        type={type}
        value={value}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
      {helperText && <s.HelperText>{helperText}</s.HelperText>}
      {error && <s.HelperText>{helperText}</s.HelperText>}
    </s.InputFieldWrapper>
  );
}
