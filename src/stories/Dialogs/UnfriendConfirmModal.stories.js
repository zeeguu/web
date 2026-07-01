import { UnfriendConfirmModal } from "../../profile/UnfriendConfirmModal";

export default {
  title: "Dialogs/UnfriendConfirmModal",
  component: UnfriendConfirmModal,
};

export const Default = {
  args: {
    open: true,
    onClose: () => {},
    onConfirm: () => {},
    displayName: "Ada",
    isPendingConfirm: false,
  },
};
