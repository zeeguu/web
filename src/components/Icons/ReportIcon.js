import React from "react";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import IconButton from "./IconButton";

export default function ReportIcon({ onClick, ariaLabel = "Report broken article" }) {
  return (
    <IconButton onClick={onClick} ariaLabel={ariaLabel}>
      <FlagOutlinedIcon />
    </IconButton>
  );
}
