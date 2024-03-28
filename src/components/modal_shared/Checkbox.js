import * as s from "./Checkbox.sc";

export default function Checkbox({ label, checked, onChange }) {
  return (
    <s.CheckboxWrapper>
      <input
        onChange={onChange}
        checked={checked}
        id="checkbox"
        name=""
        value=""
        type="checkbox"
      ></input>
      <label htmlFor="checkbox">{label}</label>
    </s.CheckboxWrapper>
  );
}
