import * as s from "./ListOfSettingItems.sc";

export default function ListOfSettingItems({ children, header }) {
  return (
    <s.SettingsSection>
      <h2>{header}</h2>
      <s.ListOfSettingItems>{children}</s.ListOfSettingItems>
    </s.SettingsSection>
  );
}
