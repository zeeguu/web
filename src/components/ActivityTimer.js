import { timeToHumanReadable } from "../utils/misc/readableTime";

export default function ActivityTimer({
  message,
  sessionDuration,
  isTimerActive,
  placement = "bottom",
  backgroundColor = "white",
}) {
  let style = {
    position: "fixed",
    backgroundColor: backgroundColor,
    padding: "0.5em",
    zIndex: 100,
  };
  if (placement === "top") {
    style.top = "5px";
  } else {
    style.bottom = "0px";
  }
  return (
    <div style={style}>
      <small style={{ color: "gray" }}>
        {message}: {timeToHumanReadable(sessionDuration)}{" "}
        {isTimerActive ? "" : "(paused)"}
      </small>
    </div>
  );
}
