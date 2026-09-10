import SettingsItem from "../../pages/Settings/SharedComponents/SettingsItem";
import { MemoryRouter } from "react-router-dom";
import "../../index.css";

export default {
  title: "Items/SettingsItem",
  component: SettingsItem,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  render: () => <SettingsItem path="/account_settings/profile_details">Profile Details</SettingsItem>,
};

export const WithState = {
  render: () => (
    <SettingsItem path="/account_settings/language_settings" state={{ from: "settings" }}>
      Language Settings
    </SettingsItem>
  ),
};
