import { useState } from "react";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ConfirmUnfriendModal from "./ConfirmUnfriendModal";

export default function FriendRow({
  user,
  streak,
  rowType = "friend",
  requestAccepted = false,
  isSending = false,
  isSent = false,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onUnfriend,
}) {
  const resolvedStreak = streak ?? user?.friend_streak ?? 0;
  const friendship = user?.friendship;
  const [modalOpen, setModalOpen] = useState(false);

  const renderActions = () => {
    if (rowType === "search") {
      if (friendship && friendship.friend_request_status === "accepted") {
        return (
          <span
            style={{
              color: "green",
              display: "flex",
              alignItems: "center",
              gap: "0.4em",
            }}
          >
            <PersonIcon
              sx={{ color: "#2ecc40", fontSize: "1.4rem", verticalAlign: "middle" }}
            />
            <span>Already friends</span>
          </span>
        );
      }

      if (friendship && friendship.friend_request_status === "pending") {
        if (friendship.sender_id === user?.id) {
          return <span style={{ color: "orange" }}>They sent you a request</span>;
        }

        return (
          <button
            style={{
              padding: "0.3em 0.8em",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#ffe0e0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4em",
            }}
            onClick={() => onCancelRequest?.(user?.id)}
          >
            <CancelScheduleSendIcon
              sx={{ color: "#e74c3c", fontSize: "1.2rem", verticalAlign: "middle" }}
            />
            <span>Cancel Request</span>
          </button>
        );
      }

      return (
        <button
          style={{
            padding: "0.3em 0.8em",
            borderRadius: "4px",
            border: "1px solid #ccc",
            background: "#e0f7fa",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4em",
          }}
          onClick={() => onSendRequest?.(user?.id)}
          disabled={isSending || isSent}
        >
          {isSent ? (
            <>
              <MarkEmailReadIcon
                sx={{ color: "#2ecc40", fontSize: "1.4rem", verticalAlign: "middle" }}
              />
              <span>Sent</span>
            </>
          ) : isSending ? (
            <>
              <SendIcon
                sx={{ color: "#3498db", fontSize: "1.4rem", verticalAlign: "middle" }}
              />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PersonAddIcon
                sx={{ color: "#3498db", fontSize: "1.4rem", verticalAlign: "middle" }}
              />
              <span>Add Friend</span>
            </>
          )}
        </button>
      );
    }

    if (rowType === "request") {
      return (
        <>
          <button
            style={{
              padding: "0.3em 0.8em",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#e0ffe0",
              cursor: requestAccepted ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4em",
            }}
            onClick={() => onAcceptRequest?.(user?.id)}
            disabled={requestAccepted}
          >
            {requestAccepted ? (
              "Accepted"
            ) : (
              <>
                <CheckIcon sx={{ color: "#2ecc40", fontSize: "1.4rem", verticalAlign: "middle" }} />
                <span>Accept</span>
              </>
            )}
          </button>
          {!requestAccepted && (
            <button
              style={{
                padding: "0.3em 0.8em",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "#ffe0e0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4em",
              }}
              onClick={() => onRejectRequest?.(user?.id)}
            >
              <ClearIcon sx={{ color: "#e74c3c", fontSize: "1.4rem", verticalAlign: "middle" }} />
              <span>Reject</span>
            </button>
          )}
        </>
      );
    }

    return (
      <>
        <button
          style={{
            padding: "0.3em 0.8em",
            borderRadius: "4px",
            border: "1px solid #ccc",
            background: "#ffe0e0",
            cursor: "pointer",
          }}
          onClick={() => setModalOpen(true)}
        >
          <PersonRemoveIcon sx={{ color: "#e74c3c", fontSize: "1.4rem", verticalAlign: "middle" }} />
          <span style={{ marginLeft: "0.4em" }}>Unfriend</span>
        </button>
      </>
    );
  };

  return (
    <>
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
          {renderActions()}
        </div>
      </li>
      <ConfirmUnfriendModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          setModalOpen(false);
          onUnfriend?.(user?.id);
        }}
        friendName={user?.name}
      />
    </>
  );
}
