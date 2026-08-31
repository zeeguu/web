import LeaderboardRow from "../../leaderboards/LeaderboardRow";

export default {
  title: "Lists&Tables/LeaderboardRow",
  component: LeaderboardRow,
};

const sampleUser = {
  username: "brad",
  name: "Brad Pitt",
  avatar: {
    image_name: "1",
    character_color: "blue",
    background_color: "light",
  },
};

export const Default = {
  render: () => (
    <table>
      <tbody>
        <LeaderboardRow rank={1} user={sampleUser} metrics={[{ key: "words", value: "1,240", align: "right" }]} />
      </tbody>
    </table>
  ),
};
