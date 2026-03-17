import { useState } from "react";
import * as s from "./FriendRow.sc";
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
          <s.AlreadyFriends>
            <PersonIcon sx={{ color: "#2ecc40", fontSize: "1.4rem", verticalAlign: "middle" }} />
            <span>Already friends</span>
          </s.AlreadyFriends>
        );
      }

      if (friendship && friendship.friend_request_status === "pending") {
        if (friendship.sender_id === user?.id) {
          return <s.RequestSent>They sent you a request</s.RequestSent>;
        }
        return (
          <s.ActionButton variant="cancel" onClick={() => onCancelRequest?.(user?.id)}>
            <CancelScheduleSendIcon sx={{ color: "#e74c3c", fontSize: "1.2rem", verticalAlign: "middle" }} />
            <span>Cancel Request</span>
          </s.ActionButton>
        );
      }
      return (
        <s.ActionButton
          variant="add"
          onClick={() => onSendRequest?.(user?.id)}
          disabled={isSending || isSent}
        >
          {isSent ? (
            <>
              <MarkEmailReadIcon sx={{ color: "#2ecc40", fontSize: "1.4rem", verticalAlign: "middle" }} />
              <span>Sent</span>
            </>
          ) : isSending ? (
            <>
              <SendIcon sx={{ color: "#3498db", fontSize: "1.4rem", verticalAlign: "middle" }} />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PersonAddIcon sx={{ color: "#3498db", fontSize: "1.4rem", verticalAlign: "middle" }} />
              <span>Add Friend</span>
            </>
          )}
        </s.ActionButton>
      );
    }

    if (rowType === "request") {
      return (
        <>
          <s.ActionButton
            variant="accept"
            onClick={() => onAcceptRequest?.(user?.id)}
            disabled={requestAccepted}
          >
            {requestAccepted ? (
              <>
                <CheckIcon sx={{ color: "#2ecc40", fontSize: "1.4rem", verticalAlign: "middle" }} />
                <span>Accepted</span>
              </>
            ) : (
              <>
                <CheckIcon sx={{ color: "#2ecc40", fontSize: "1.4rem", verticalAlign: "middle" }} />
                <span>Accept</span>
              </>
            )}
          </s.ActionButton>
          {!requestAccepted && (
            <s.ActionButton variant="reject" onClick={() => onRejectRequest?.(user?.id)}>
              <ClearIcon sx={{ color: "#e74c3c", fontSize: "1.4rem", verticalAlign: "middle" }} />
              <span>Reject</span>
            </s.ActionButton>
          )}
        </>
      );
    }

    return (
      <>
        <s.ActionButton variant="unfriend" onClick={() => setModalOpen(true)}>
          <PersonRemoveIcon sx={{ color: "#e74c3c", fontSize: "1.4rem", verticalAlign: "middle" }} />
          <s.UnfriendSpan>Unfriend</s.UnfriendSpan>
        </s.ActionButton>
      </>
    );
  };

  return (
    <>
      <s.FriendRowLi>
        <s.FriendIcon role="img" aria-label="friend">👤</s.FriendIcon>
        <s.FriendUsername>@{user?.username}</s.FriendUsername>
        <s.FriendName>{user?.name}</s.FriendName>
        {rowType === "friend" && (
          <s.StreakContainer>
            <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
            <span>{resolvedStreak}</span>
          </s.StreakContainer>
        )}
        <s.ActionsContainer>{renderActions()}</s.ActionsContainer>
      </s.FriendRowLi>
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
