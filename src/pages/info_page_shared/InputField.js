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
    </s.InputFieldWrapper>
  );
}
