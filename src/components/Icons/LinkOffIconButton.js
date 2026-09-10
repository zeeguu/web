import React from "react";
import LinkOffIcon from "@mui/icons-material/LinkOff";

export default function LinkOffIconButton({ onClick, ariaLabel = "Unlink word", style = {}, iconStyle = {} }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.2em",
        height: "1.2em",
        ...style,
      }}
    >
      <LinkOffIcon style={{ fontSize: "1.2em", ...iconStyle }} />
    </button>
  );
}
