import * as s from "../pages/info_page_shared/InputField.sc";

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
  children,
}) {
  return (
    <s.FieldLabelContainer>
      <s.Label htmlFor={id}>{label}</s.Label>
      <s.InputWrapper>
        <s.Input
          className={`${isError && "error"}`}
          type={type}
          value={value}
          name={name}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
        />
        {children}
      </s.InputWrapper>
      {helperText && <s.HelperText>{helperText}</s.HelperText>}
      {isError && errorMessage && (
        <s.ErrorMessage>{errorMessage}</s.ErrorMessage>
      )}
    </s.FieldLabelContainer>
  );
}
