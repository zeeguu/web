import * as s from "./SelectOptions.sc";

export default function SelectOptions({
  placeholder,
  options,
  label,
  val,
  onChange,
  current,
  id,
  name,
  selectLabel,
}) {
  return (
    <s.SelectOptionsdWrapper>
      <s.Label htmlFor={id} name={name}>
        {selectLabel}
      </s.Label>
      <s.Select id={id} onChange={(e) => onChange(e.target.value)}>
        <option style={{ display: "none" }} />
        <option value="" disabled selected>{placeholder}</option>

        {options?.map((option) => (
          <option
            key={val(option)}
            value={val(option)}
            selected={current === val(option)}
          >
            {label(option)}
          </option>
        ))}
      </s.Select>
    </s.SelectOptionsdWrapper>
  );
}
