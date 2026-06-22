import ListOfSettingsItems from "../../pages/Settings/SharedComponents/ListOfSettingsItems";
import SettingsItem from "../../pages/Settings/SharedComponents/SettingsItem";
import { MemoryRouter } from "react-router-dom";
import "../../index.css";

export default {
  title: "Settings/ListOfSettingsItems",
  component: ListOfSettingsItems,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  render: () => (
    <ListOfSettingsItems header="My Account">
      <SettingsItem path="/account_settings/profile_details">Profile Details</SettingsItem>
      <SettingsItem path="/account_settings/language_settings">Language Settings</SettingsItem>
      <SettingsItem path="/account_settings/interests">Feed Preferences</SettingsItem>
    </ListOfSettingsItems>
  ),
};
