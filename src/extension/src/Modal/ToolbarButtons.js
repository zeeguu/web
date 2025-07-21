import * as s from "../../../reader/ArticleReader.sc";
import toggle from "../../../utils/misc/toggle";
import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import colors from "../colors";

const t = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          // Controls default (unchecked) color for the thumb
          color: "#ccc",
        },
        colorPrimary: {
          "&.Mui-checked": {
            // Controls checked color for the thumb
            color: "#ffbb54",
          },
        },
        track: {
          // Controls default (unchecked) color for the track
          opacity: 0.7,
          backgroundColor: "#999999",
          ".Mui-checked.Mui-checked + &": {
            // Controls checked color for the track
            opacity: 0.5,
            backgroundColor: "#ffbb54",
          },
        },
      },
    },
  },
});

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function ToolbarButtons({
  translating,
  setTranslating,
  pronouncing,
  setPronouncing,
}) {
  return (
    <s.Toolbar style={{ float: "right", width: "auto", height: "auto" }}>
      <ThemeProvider theme={t}>
        <FormGroup style={{ color: `${colors.darkBlue}` }}>
          <FormHelperText>
            {<small>{"Click word(s) to:"}</small>}
          </FormHelperText>
          <FormControlLabel
            control={<Android12Switch />}
            checked={translating}
            className={translating ? "selected" : ""}
            onClick={(e) => toggle(translating, setTranslating)}
            label={
              <b>
                <small>{"See translation"}</small>
              </b>
            }
          />
          <FormControlLabel
            control={<Android12Switch />}
            checked={pronouncing}
            className={pronouncing ? "selected" : ""}
            onClick={(e) => toggle(pronouncing, setPronouncing)}
            label={
              <b>
                <small>{"Hear pronunciation"}</small>
              </b>
            }
          />
        </FormGroup>
      </ThemeProvider>
    </s.Toolbar>
  );
}
