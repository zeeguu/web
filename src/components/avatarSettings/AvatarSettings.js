import React, { useState } from "react";

import { Popover } from "@mui/material";
import * as s from "./AvatarSettings.sc";
import { LogOut, Settings } from "../icons/sidebar";
import { iconsGray, zeeguuSecondOrange } from "../colors";
import strings from "../../i18n/definitions";
import { Link, useLocation } from "react-router-dom";

const AvatarSettings = ({ user }) => {
  const path = useLocation().pathname;

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
      <s.Avatar>
        <img src="/static/images/default-avatar.svg" alt="default-avatar" />
      </s.Avatar>
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
        <Link to="/account_settings/personalData">
          <s.NavigationLink
            style={{
              borderBottom: path.startsWith("/account_settings")
                ? `2px solid ${zeeguuSecondOrange}`
                : "",
            }}
          >
            <Settings
              color={path.startsWith("/account_settings") ? "white" : iconsGray}
              style={{ marginRight: "10px" }}
              width="15px"
              height="15px"
            />
            <span>{strings.settings}</span>
          </s.NavigationLink>
        </Link>

        <Link
          to="/"
          onClick={() => {
            user.logoutMethod();
          }}
        >
          <s.NavigationLink>
            <LogOut
              color={iconsGray}
              style={{ marginRight: "10px" }}
              width="15px"
              height="15px"
            />
            <span>{strings.logout}</span>
          </s.NavigationLink>
        </Link>
      </Popover>
    </s.AvatarBox>
  );
};

export default AvatarSettings;
