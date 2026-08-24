import * as s from "./Modal.sc";
import ModalMui from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function Modal({
  children,
  open,
  onClose,
  wrapperBackgroundColor = "var(--card-bg)",
  hideCloseButton = false,
  // Opt-in: on phones (<=576px) render as a full-width bottom sheet (anchored
  // to the bottom edge, rounded top) instead of a centered 92% card — for
  // immersive content like the article preview overlay.
  bottomSheetOnMobile = false,
  // Opt-in: drop the wrapper's bottom padding so a sticky footer can sit flush
  // with the bottom edge (the footer then supplies its own inner padding).
  flushBottom = false,
  // Opt-in: a subtle rise-in animation on open (mobile bottom sheet only).
  animateIn = false,
  // Inline style merged onto the wrapper (e.g. a swipe-to-dismiss transform).
  // Applied via the style prop — which MUI preserves, unlike a forwarded ref.
  wrapperStyle,
  // Opt-in: a heavier backdrop than MUI's default (0.5) so busy content behind
  // the modal — e.g. the feed under the article preview overlay on desktop —
  // recedes instead of competing with the foreground card.
  darkerBackdrop = false,
}) {
  return (
    <ModalMui
      open={open}
      onClose={onClose}
      slotProps={
        darkerBackdrop
          ? {
              backdrop: {
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.78)",
                  // A light blur pushes the busy feed out of focus so it reads
                  // as "behind," not as a competing second layer — darkening
                  // alone barely registers on the already-dark theme.
                  backdropFilter: "blur(2px)",
                },
              },
            }
          : undefined
      }
    >
      <s.ModalWrapper
        style={wrapperStyle}
        $bg={wrapperBackgroundColor}
        $bottomSheetOnMobile={bottomSheetOnMobile}
        $flushBottom={flushBottom}
        $animateIn={animateIn}
      >
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
