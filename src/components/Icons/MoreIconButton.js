import React from "react";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import IconButton from "./IconButton";

export default function MoreIconButton({ onClick, title }) {
  return (
    <IconButton onClick={onClick} ariaLabel={title} aria-haspopup="true">
      <MoreHorizRoundedIcon />
    </IconButton>
  );
}
