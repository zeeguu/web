import { fn, userEvent, within } from "storybook/test";
import RemoveBookmarkModal from "./RemoveBookmarkModal";

export default {
  title: "Dialogs/RemoveBookmarkModal",
  component: RemoveBookmarkModal,
  args: {
    open: true,
    exerciseBookmarks: [{ id: 1, from: "learn", to: "apprendre" }],
    // fn() records each call in the Actions tab instead of hitting the API.
    setOpen: fn(),
    uploadUserFeedback: fn(),
    setHasProvidedQuickFeedback: fn(),
  },
};

export const Default = {};

// The free-text form the learner gets after clicking "Other".
export const OtherFeedback = {
  play: async ({ canvasElement }) => {
    // The modal renders in a portal on <body>, outside the story's own root.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByText("Other"));
  },
};
