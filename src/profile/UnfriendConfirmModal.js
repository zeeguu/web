import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Heading from "../components/modal_shared/Heading.sc";
import Main from "../components/modal_shared/Main.sc";
import Button from "../pages/_pages_shared/Button.sc";
import * as s from "./UnfriendConfirmModal.sc";

export function UnfriendConfirmModal({ open, onClose, onConfirm, displayName, isPendingConfirm }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Header>
        <Heading>Confirm Unfriend</Heading>
      </Header>
      <Main>
        <div>
          Are you sure you want to unfriend <b>{displayName}</b>?
        </div>
        <s.UnfriendModalButtonWrapper>
          <Button type={"button"} className={"small grey"} onClick={onClose}>
            Cancel
          </Button>
          <Button type={"button"} className={"small warning"} onClick={onConfirm} disabled={isPendingConfirm}>
            Unfriend
          </Button>
        </s.UnfriendModalButtonWrapper>
      </Main>
    </Modal>
  );
}
