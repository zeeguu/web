import React from "react";
import { ErrorDialogWrapper, ErrorDialogDescription, ErrorDialogButton } from "./ErrorDialog.sc";

export default function ErrorDialog({
  title = "Could not open",
  message,
  detail,
  onBack,
  backLabel = "Go to Articles",
}) {
  return (
    <ErrorDialogWrapper>
      <h2>{title}</h2>
      <p>{message}</p>
      {detail && <ErrorDialogDescription>{detail}</ErrorDialogDescription>}
      <ErrorDialogButton onClick={onBack}>{backLabel}</ErrorDialogButton>
    </ErrorDialogWrapper>
  );
}
