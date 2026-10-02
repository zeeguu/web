import { gray, zeeguuOrange } from "./colors";

export const reportDialogContentStyles = {
  display: "flex",
  flexDirection: "column",
  paddingTop: "0px",
  minWidth: "14em",
};

// The text box and the send arrow, side by side under the reasons.
export const reportDialogInputRowStyles = {
  display: "flex",
  alignItems: "center",
};

// MUI has no theme in this app, so its dialog stays white in dark mode; these
// put it on the app's own surface and text colours.
export const reportDialogPaperStyles = {
  backgroundColor: "var(--bg-secondary)",
  color: "var(--text-primary)",
};

export const reportDialogTextFieldStyles = {
  flex: 1,
  "& .MuiInputBase-input": { color: "var(--text-primary)" },
  "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border-color)" },
};

export const reportDialogCloseButtonStyles = {
  position: "absolute",
  right: 8,
  top: 8,
  color: (theme) => theme.palette.grey[500],
};

export const reportDialogSendButtonStyles = (isDisabled) => ({
  color: isDisabled ? gray : zeeguuOrange,
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
