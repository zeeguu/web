import React, { useState } from "react";

import { Popover, Typography } from "@mui/material";
import * as s from "./AvatarSettings.sc";

const AvatarSettings = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    if (anchorEl) return handleClose();
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <s.AvatarBox onClick={handleClick}>
      <img src="/static/images/defaultAvatar.png" alt="defaultAvatar" />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </s.AvatarBox>
  );
};

export default AvatarSettings;
