import * as s from "./InputField.sc";

export default function InputField({
  ref,
  type,
  label,
  name,
  id,
  placeholder,
  onChange,
  value,
  helperText,
  helperLink,
  helperLinkHref,
}) {
  return (
    <s.InputFieldWrapper>
      <s.Label htmlFor={id}>{label}</s.Label>
      <s.Input
        ref={ref}
        type={type}
        value={value}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
      {helperText && <s.HelperText>{helperText}</s.HelperText>}
      {helperLink && (
        <s.HelperLink href={helperLinkHref}>{helperLink}</s.HelperLink>
      )}
    </s.InputFieldWrapper>
  );
}
