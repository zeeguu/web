import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { veryLightGrey } from "../components/colors";

export default function ReadingCompletionProgress(props) {
  const { value: value } = props;
  if (isNaN(value) || value === 0) return <></>;
  return (
    <>
      <CircularProgress
        variant="determinate"
        value={100}
        style={{ position: "absolute", color: veryLightGrey, right: "0" }}
      />
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" {...props} />
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
              <Typography
                variant="caption"
                component="div"
                sx={{ color: "text.secondary", fontWeight: "600" }}
              >{`${Math.round(value)}%`}</Typography>
            </>
          ) : (
            <DoneIcon style={{ color: "green" }}></DoneIcon>
          )}
        </Box>
      </Box>
    </>
  );
}
