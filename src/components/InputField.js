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
  children,
  autoFocus,
  lang,
  spellCheck,
  inputRef,
  inputMode,
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
          autoFocus={autoFocus}
          lang={lang}
          spellCheck={spellCheck}
          ref={inputRef}
          inputMode={inputMode}
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
