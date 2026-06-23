import React from "react";
import { errorDialogWrapper, errorDialogDescription, errorDialogButton } from "./ErrorDialog.sc";

export default function ErrorDialog({
  title = "Could not open",
  message,
  detail,
  onBack,
  backLabel = "Go to Articles",
}) {
  return (
    <div style={errorDialogWrapper}>
      <h2>{title}</h2>
      <p>{message}</p>
      {detail && <p style={errorDialogDescription}>{detail}</p>}
      <button onClick={onBack} style={errorDialogButton}>
        {backLabel}
      </button>
    </div>
  );
}
