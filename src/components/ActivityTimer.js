export default function ActivityTimer({
  message,
  activeSessionDuration,
  clockActive,
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
        {message}: {activeSessionDuration} {clockActive ? "" : "(paused)"}
      </small>
    </div>
  );
}
