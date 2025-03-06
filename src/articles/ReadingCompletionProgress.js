import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import DoneIcon from "@mui/icons-material/Done";
import { veryLightGrey, transparentDarkGreen } from "../components/colors";

export default function ReadingCompletionProgress({ value }) {
  const colorValue = value < 100 ? "grey" : transparentDarkGreen;
  if (isNaN(value) || value === 0) return <></>;
  return (
    <>
      <CircularProgress
        variant="determinate"
        value={100}
        size={50}
        style={{
          position: "absolute",
          color: veryLightGrey,
          right: "0",
        }}
      />
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={value}
          style={{ color: colorValue }}
          size={50}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value < 100 ? (
            <>
              <span
                style={{
                  color: "text.secondary",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >{`${Math.round(value)}%`}</span>
            </>
          ) : (
            <DoneIcon style={{ color: "green", fontSize: "28px" }}></DoneIcon>
          )}
        </Box>
      </Box>
    </>
  );
}
