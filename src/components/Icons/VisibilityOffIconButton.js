import React from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function VisibilityOffIconButton({
  onClick,
  ariaLabel = "Hide translation",
  style = {},
  iconStyle = {},
}) {
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
      <VisibilityOffIcon style={{ fontSize: "1.2em", ...iconStyle }} />
    </button>
  );
}
