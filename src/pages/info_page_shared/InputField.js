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
      {helperText && (
        <s.HelperText className={`${isError && "error"}`}>
          {helperText}
        </s.HelperText>
      )}
    </s.InputFieldWrapper>
  );
}
