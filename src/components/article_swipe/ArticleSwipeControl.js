import React from "react";
import { Bar, DismissButton, OpenButton, SaveButton, ButtonInner } from "./ArticleSwipeControl.sc.js";
import { white } from "../colors";
import SwipeIcon from "./SwipeIcon.js";
import { toast } from "react-toastify";

export default function ArticleSwipeControl({ onDismiss, onDismissUndo, onOpen, onSave, children, isSaved = false }) {
  function handleDismiss() {
    onDismiss();

    // only ui for now since missing an endpoint
    const t = toast(
      <span>
        Article hidden.
        <u
          onClick={() => {
            toast.dismiss(t);
            if (typeof onDismissUndo === "function") {
              onDismissUndo();
            }
          }}
          style={{
            cursor: "pointer",
            marginLeft: "6px",
            fontStyle: "italic",
            textDecoration: "underline",
          }}
        >
          Undo?
        </u>
      </span>,
    );
  }
  return (
    <Bar>
      <DismissButton onClick={handleDismiss} aria-label="Dismiss">
        <ButtonInner>
          <SwipeIcon name="dismiss" color={white} size={30} />
        </ButtonInner>
      </DismissButton>

      <OpenButton onClick={onOpen} aria-label="Open Article">
        <ButtonInner>
          <SwipeIcon name="open" color={white} size={26} />
        </ButtonInner>
      </OpenButton>

      {children ? (
        <SaveButton as="div" aria-label="Save Article">
          <ButtonInner>{children}</ButtonInner>
        </SaveButton>
      ) : (
        <SaveButton onClick={onSave} aria-label="Save Article" className={isSaved ? "saved" : ""}>
          <ButtonInner>
            <SwipeIcon className="heart-outline" name="save" color={white} size={26} />
            <SwipeIcon className="heart-filled" name="saveFilled" color={white} size={26} />
          </ButtonInner>
        </SaveButton>
      )}
    </Bar>
  );
}
