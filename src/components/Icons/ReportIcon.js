import React from "react";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

export default function ReportIcon({ onClick, ariaLabel = "Report broken article", style = {} }) {
  return (
    <div
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        padding: "0.5rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <FlagOutlinedIcon style={{ fontSize: "1.4em", color: "#999" }} />
    </div>
  );
}
