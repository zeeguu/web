import { FriendActionButtons } from "../../profile/FriendActionButtons";
import "../../index.css";

const friendActionHandlers = {
  onAdd: () => {},
  onCancel: () => {},
  onAccept: () => {},
  onReject: () => {},
  onUnfriend: () => {},
};

export default {
  title: "Buttons/FriendActionButtons",
  component: FriendActionButtons,
};

export const Add = {
  render: () => (
    <FriendActionButtons
      profileData={{ username: "ada" }}
      friendActionHandlers={friendActionHandlers}
      isFriendAccepted={false}
      isPendingFriendAction={false}
    />
  ),
};

export const PendingRequestFromMe = {
  render: () => (
    <FriendActionButtons
      profileData={{ username: "ada" }}
      friendship={{ is_accepted: false, sender_username: "me" }}
      isFriendAccepted={false}
      friendActionHandlers={friendActionHandlers}
      isPendingFriendAction={false}
    />
  ),
};

export const PendingRequestFromThem = {
  render: () => (
    <FriendActionButtons
      profileData={{ username: "ada" }}
      friendship={{ is_accepted: false, sender_username: "ada" }}
      isFriendAccepted={false}
      friendActionHandlers={friendActionHandlers}
      isPendingFriendAction={false}
    />
  ),
};

export const Accepted = {
  render: () => (
    <FriendActionButtons
      profileData={{ username: "ada" }}
      friendship={{ is_accepted: true }}
      isFriendAccepted={true}
      friendActionHandlers={friendActionHandlers}
      isPendingFriendAction={false}
    />
  ),
};
