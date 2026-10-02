import { toast } from "react-toastify";
import { UndoToastRow, TextLinkButton } from "./UndoToast.sc";

// A toast saying what just happened, with an Undo. The toast closes first, then
// `onUndo` runs. `type` picks react-toastify's variant ("success", "info", ...).
export function showUndoToast(message, onUndo, { type = "default", autoClose = 5000 } = {}) {
  return toast(
    ({ closeToast }) => (
      <UndoToastRow>
        <span>{message}</span>
        <TextLinkButton
          onClick={() => {
            closeToast();
            onUndo();
          }}
        >
          Undo
        </TextLinkButton>
      </UndoToastRow>
    ),
    { type, autoClose },
  );
}
