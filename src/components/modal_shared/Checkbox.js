import * as s from "./Checkbox.sc";

export default function Checkbox({ label, checked, onChange, id }) {
  return (
    <s.CheckboxWrapper>
      <input
        onChange={onChange}
        checked={checked}
        id={id}
        name=""
        value=""
        type="checkbox"
      ></input>
      <label htmlFor={id}>{label}</label>
    </s.CheckboxWrapper>
  );
}
