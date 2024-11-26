import { timeToDigitalClock } from "../utils/misc/readableTime";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import * as s from "./DigitalTimer.sc";

export default function DigitalTimer({
  activeSessionDuration,
  clockActive,
  style,
  precision,
}) {
  return (
    <s.DigitalClock
      className={clockActive ? "" : "disabled"}
      style={{ ...style }}
    >
      <AccessTimeIcon fontSize="small" />
      {timeToDigitalClock(
        activeSessionDuration,
        precision ? "minutes" : precision,
      )}{" "}
    </s.DigitalClock>
  );
}
