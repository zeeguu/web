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
  isError,
  errorMessage,
}) {
  return (
    <s.InputFieldWrapper>
      <s.Label htmlFor={id}>{label}</s.Label>
      <s.Input
        className={`${isError && "error"}`}
        type={type}
        value={value}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
      {helperText && <s.HelperText>{helperText}</s.HelperText>}
      {isError && errorMessage && (
        <s.ErrorMessage>{errorMessage}</s.ErrorMessage>
      )}
    </s.InputFieldWrapper>
  );
}
