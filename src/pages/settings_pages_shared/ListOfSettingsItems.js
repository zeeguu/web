import * as s from "./ListOfSettingsItems.sc";

export default function ListOfSettingsItems({ children, header }) {
  return (
    <s.SettingsSection>
      <h2>{header}</h2>
      <s.ListOfSettingsItems>{children}</s.ListOfSettingsItems>
    </s.SettingsSection>
  );
}
