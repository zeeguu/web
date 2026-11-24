import { fn } from "storybook/test";
import ReminderOfferModal from "./ReminderOfferModal";

export default {
  title: "Dialogs/ReminderOfferModal",
  component: ReminderOfferModal,
  args: { open: true, time: "19:00", onAccept: fn(), onDecline: fn() },
};

export const FirstDay = { args: { streak: 1 } };

export const LongerStreak = { args: { streak: 12 } };
