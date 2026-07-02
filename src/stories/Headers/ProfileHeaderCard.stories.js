import { ProfileHeaderCard } from "../../profile/ProfileHeaderCard";
import "../../index.css";

const profileData = {
  username: "witty beaver",
  name: "Ada Lovelace",
  created_at: "2024-01-10T00:00:00.000Z",
  user_avatar: {
    image_name: "avatar-1",
    character_color: "#2f80ed",
    background_color: "#f2f2f2",
  },
  friendship: null,
};

export default {
  title: "Headers/ProfileHeaderCard",
  component: ProfileHeaderCard,
};

export const Default = {
  render: () => (
    <ProfileHeaderCard
      isOwnProfile={true}
      profileData={profileData}
      activeLanguages={[
        { code: "en", name: "English" },
        { code: "da", name: "Danish" },
        { code: "de", name: "German" },
      ]}
      onOpenLanguagesModal={() => {}}
      onEditProfile={() => {}}
      friendActionHandlers={{}}
      isPendingFriendAction={false}
    />
  ),
};
