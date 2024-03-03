import * as s from "../RedirectionNotificationModal.sc";

export default function Checkbox({ label, checked, onChange }) {
  return (
    <>
      <s.CheckboxWrapper>
        <input
          onChange={onChange}
          checked={checked}
          notificationType="checkbox"
          id="checkbox"
          name=""
          value=""
          type="checkbox"
        ></input>
        <label htmlFor="checkbox">{label}</label>
      </s.CheckboxWrapper>
    </>
  );
}
