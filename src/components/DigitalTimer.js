import { timeToDigitalClock } from "../utils/misc/readableTime";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import * as s from "./DigitalTimer.sc";

export default function DigitalTimer({
  sessionDuration,
  isTimerActive,
  style,
  precision,
  showClock,
}) {
  return (
    <s.DigitalClock
      className={isTimerActive ? "" : "disabled"}
      style={{ ...style }}
    >
      {showClock && <AccessTimeIcon fontSize="small" />}
      {timeToDigitalClock(
        sessionDuration,
        precision ? "minutes" : precision,
      )}{" "}
    </s.DigitalClock>
  );
}
