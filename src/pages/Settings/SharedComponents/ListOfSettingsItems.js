import * as s from "./ListOfSettingsItems.sc";

export default function ListOfSettingsItems({ children, header, icon }) {
  return (
    <s.SettingsSection>
      <h2>
        {header}
        {icon}
      </h2>
      <s.ListOfSettingsItems>{children}</s.ListOfSettingsItems>
    </s.SettingsSection>
  );
}
