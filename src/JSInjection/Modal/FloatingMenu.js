// FloatingMenu.js
import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import colors from "../colors";

const FloatingMenu = ({ buttons, buttonGroupVisible, toggleButtonGroup }) => (
  <div sx={{ zIndex: 4 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', float: 'right', right: '3em', bottom: '7em', overflow: 'hidden', width: "17em", position: 'absolute' }}>
      {buttonGroupVisible && (
        <ButtonGroup sx={{ zIndex: 4, boxShadow: 0 }} orientation="vertical" aria-label="vertical contained button group" variant="contained">
          {buttons}
        </ButtonGroup>
      )}
      <div display="flex" float="left">
        <Fab
          sx={{
            margin: "10px",
            backgroundColor: colors.darkBlue,
            '&:hover': {
              backgroundColor: colors.lighterBlue,
              color: colors.darkGray,
            },
          }}
          color="primary"
          aria-label="add"
          position="fixed"
          onClick={toggleButtonGroup}
        >
          {buttonGroupVisible ? <CloseSharpIcon /> : <AddIcon />}
        </Fab>
      </div>
    </Box>
  </div>
);

export default FloatingMenu;