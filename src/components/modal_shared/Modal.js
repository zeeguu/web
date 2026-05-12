import * as s from "./Modal.sc";
import ModalMui from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function Modal({
  children,
  open,
  onClose,
  wrapperBackgroundColor = "var(--card-bg)",
  hideCloseButton = false,
}) {
  return (
    <ModalMui open={open} onClose={onClose}>
      <s.ModalWrapper $bg={wrapperBackgroundColor}>
        {children}
        {!hideCloseButton && (
          <s.CloseButton aria-label="Close Modal" onClick={onClose}>
            <CloseRoundedIcon fontSize="medium" />
          </s.CloseButton>
        )}
      </s.ModalWrapper>
    </ModalMui>
  );
}
