import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import DoneIcon from "@mui/icons-material/Done";
import { veryLightGrey, transparentDarkGreen } from "../components/colors";

export default function ReadingCompletionProgress({ last_reading_percentage }) {
  const readingCompletion = last_reading_percentage * 100;
  const colorValue = readingCompletion < 100 ? "grey" : transparentDarkGreen;
  if (isNaN(readingCompletion) || readingCompletion === 0) return <></>;
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
          value={readingCompletion}
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
          {readingCompletion < 100 ? (
            <>
              <span
                style={{
                  color: "text.secondary",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >{`${Math.round(readingCompletion)}%`}</span>
            </>
          ) : (
            <DoneIcon style={{ color: "green", fontSize: "28px" }}></DoneIcon>
          )}
        </Box>
      </Box>
    </>
  );
}
