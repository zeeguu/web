import React from "react";
import {
  sharedArticleErrorWrapper,
  sharedArticleErrorDescription,
  sharedArticleErrorButton,
} from "./SharedArticleErrorDialog.sc";

export default function SharedArticleErrorDialog({ errorMessage, sharedUrl, uploadId, onBack }) {
  return (
    <div style={sharedArticleErrorWrapper}>
      <h2>Could not open article</h2>
      <p>{errorMessage}</p>
      <p style={sharedArticleErrorDescription}>{sharedUrl || (uploadId ? `upload #${uploadId}` : null)}</p>
      <button onClick={onBack} style={sharedArticleErrorButton}>
        Go to Articles
      </button>
    </div>
  );
}
