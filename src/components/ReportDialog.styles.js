import { gray, darkBlue } from "./colors";

export const reportDialogContentStyles = {
  display: "flex",
  paddingTop: "0px",
  minWidth: "14em",
};

export const reportDialogCloseButtonStyles = {
  position: "absolute",
  right: 8,
  top: 8,
  color: (theme) => theme.palette.grey[500],
};

export const reportDialogSendButtonStyles = (isDisabled) => ({
  color: isDisabled ? gray : darkBlue,
  fontSize: "medium",
});

export const reportDialogSuccessTextStyles = {
  marginTop: "8px",
  fontSize: "0.9em",
};

export const reportDialogSuccessItalicStyles = {
  marginTop: "8px",
  fontStyle: "italic",
};
