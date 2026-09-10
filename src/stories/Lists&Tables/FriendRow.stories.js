import FriendRow from "../../friends/FriendRow";

export default {
  title: "Lists&Tables/FriendRow",
  component: FriendRow,
};

const sampleUser = {
  username: "brad",
  name: "Brad Pitt",
  avatar: {
    image_name: "1",
    character_color: "blue",
    background_color: "light",
  },
  languages: [{ code: "en" }, { code: "es" }, { code: "fr" }],
  friendship: { friend_streak: 12 },
};

export const Default = {
  render: () => (
    <ul>
      <FriendRow user={sampleUser} />
    </ul>
  ),
};
