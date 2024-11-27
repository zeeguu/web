// FloatingMenu.js
import React from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import MenuIcon from "@mui/icons-material/Menu";
import colors from "../colors";

const FloatingMenu = ({ buttons, buttonGroupVisible, toggleButtonGroup }) => (
  <div
    style={{
      zIndex: 4,
      display: "flex",
      flexDirection: "column",
      right: "2rem",
      bottom: "1.5rem",
      overflow: "hidden",
      width: "17em",
      position: "fixed",
    }}
  >
    <Box>
      <div style={{ visibility: buttonGroupVisible ? "" : "hidden" }}>
        <ButtonGroup
          sx={{
            zIndex: 5,
            boxShadow: 0,
          }}
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="contained"
        >
          {buttons}
        </ButtonGroup>
      </div>
      <div
        style={{
          display: "flex",
          float: "right",
        }}
      >
        <Fab
          sx={{
            margin: "10px",
            backgroundColor: colors.darkBlue,
            "&:hover": {
              backgroundColor: colors.lighterBlue,
              color: colors.darkGray,
            },
          }}
          color="primary"
          aria-label="add"
          position="fixed"
          onClick={toggleButtonGroup}
        >
          {buttonGroupVisible ? <CloseSharpIcon /> : <MenuIcon />}
        </Fab>
      </div>
    </Box>
  </div>
);

export default FloatingMenu;
