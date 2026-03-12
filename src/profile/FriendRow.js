import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export default function FriendRow({ user, streak, rightContent }) {
  const resolvedStreak = streak ?? user?.friend_streak ?? 0;

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1em",
        padding: "0.5em 0",
      }}
    >
      <span role="img" aria-label="friend" style={{ fontSize: "2em" }}>
        👤
      </span>
      <span style={{ fontWeight: 600 }}>{user?.name}</span>
      <span style={{ color: "gray" }}>@{user?.username}</span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3em",
          color: "#ff9800",
          fontWeight: 500,
        }}
      >
        <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
        <span>{resolvedStreak}</span>
      </span>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
        }}
      >
        {rightContent}
      </div>
    </li>
  );
}
