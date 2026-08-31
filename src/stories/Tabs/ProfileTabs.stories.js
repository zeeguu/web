import { ProfileTabs } from "../../profile/ProfileTabs";

export default {
  title: "Tabs/ProfileTabs",
  component: ProfileTabs,
};

export const Default = {
  args: {
    tabs: [
      { key: "profile", label: "Profile" },
      { key: "settings", label: "Settings" },
    ],
    activeTab: "profile",
    onTabChange: () => {},
    children: <div>Profile content</div>,
  },
};
