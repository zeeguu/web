import * as s from "../RedirectionNotificationModal.sc";
import ModalMui from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function Modal({ children, open, onClose }) {
  return (
    <ModalMui open={open} onClose={onClose}>
      <s.ModalWrapper>
        {children}
        <s.CloseButton role="button" onClick={onClose}>
          <CloseRoundedIcon fontSize="medium" />
        </s.CloseButton>
      </s.ModalWrapper>
    </ModalMui>
  );
}
