import Stack from "@mui/material/Stack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { LanguageOverflowBubble } from "../profile/UserProfile.sc";
import UserBaseInfo from "../components/UserBaseInfo";
import * as s from "./FriendRow.sc";
import useScreenWidth from "../hooks/useScreenWidth";

export default function FriendRow({
  user,
  rowType = "friend",
  friendRequestAccepted = false,
  isSending = false,
  isSent = false,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onViewProfile,
}) {
  const { isMobile } = useScreenWidth();
  const maxVisibleLanguages = isMobile ? 1 : 3;
  const languages =
    user.languages?.sort((a, b) => {
      const keyA = a.max_streak;
      const keyB = b.max_streak;
      return keyA > keyB ? -1 : 1;
    }) ?? [];
  const visibleLanguages = languages.slice(0, maxVisibleLanguages);
  const overflowCount = languages.length > maxVisibleLanguages ? languages.length - maxVisibleLanguages : 0;

  const renderActions = () => {
    if (rowType === "view-only" || rowType === "friend") return null;

    if (rowType === "search") {
      if (user.friendship) {
        return (
          <s.AlreadyFriends>
            <PersonIcon sx={{ color: "#2ecc40", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Already friends</span>
          </s.AlreadyFriends>
        );
      }

      if (user.friend_request?.friend_request_status === "pending") {
        if (user.friend_request.sender.username === user.username) {
          return <s.RequestSent>They sent you a request</s.RequestSent>;
        }
        return (
          <s.FriendActionButton $variant="cancel" onClick={(event) => onCancelRequest?.(event, user.username)}>
            <CancelScheduleSendIcon sx={{ color: "#e74c3c", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Cancel</span>
          </s.FriendActionButton>
        );
      }

      if (isSent) {
        return (
          <s.FriendActionButton $variant="cancel" onClick={(event) => onCancelRequest?.(event, user.username)}>
            <CancelScheduleSendIcon sx={{ color: "#e74c3c", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Cancel</span>
          </s.FriendActionButton>
        );
      }

      return (
        <s.FriendActionButton
          $variant="add"
          onClick={(event) => onSendRequest?.(event, user.username)}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <SendIcon sx={{ color: "#3498db", fontSize: "1rem", verticalAlign: "middle" }} />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PersonAddIcon sx={{ color: "#3498db", fontSize: "1rem", verticalAlign: "middle" }} />
              <span>Add</span>
            </>
          )}
        </s.FriendActionButton>
      );
    }

    if (rowType === "request") {
      return friendRequestAccepted ? (
        <s.FriendActionButton $variant="accept" disabled>
          <CheckIcon sx={{ color: "#2ecc40", fontSize: "1rem", verticalAlign: "middle" }} />
          <span>Accepted</span>
        </s.FriendActionButton>
      ) : (
        <>
          <s.FriendActionButton $variant="accept" onClick={(event) => onAcceptRequest?.(event, user.username)}>
            <CheckIcon sx={{ color: "#2ecc40", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Accept</span>
          </s.FriendActionButton>
          <s.FriendActionButton $variant="reject" onClick={(event) => onRejectRequest?.(event, user.username)}>
            <ClearIcon sx={{ color: "#e74c3c", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Reject</span>
          </s.FriendActionButton>
        </>
      );
    }

    return null;
  };

  const actions = renderActions();

  return (
    <s.FriendRowLi onClick={() => onViewProfile?.(user.username)} $clickable={Boolean(onViewProfile)}>
      {rowType === "friend" && (
        <s.StreakContainer>
          <Stack direction="row" spacing={-1.2} alignItems="center">
            <LocalFireDepartmentIcon
              sx={{
                color: "#ff9800",
                fontSize: "1.4rem",
                filter: "drop-shadow(2px 0 0 var(--card-bg)) drop-shadow(0 2px 0 var(--card-bg))",
              }}
            />
            <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
          </Stack>
          <span>{user.friendship.friend_streak ?? 0}</span>
        </s.StreakContainer>
      )}

      <UserBaseInfo user={user} />

      {rowType === "friend" && (
        <s.LanguagesMeta>
          {visibleLanguages.map((entry) => (
            <DynamicFlagImage
              key={entry.language.id || entry.language.code}
              languageCode={entry.language.code}
              size={isMobile ? "1.2rem" : "1.4rem"}
            />
          ))}
          {overflowCount > 0 && (
            <LanguageOverflowBubble $size={isMobile ? "1.2rem" : "1.4rem"}>+{overflowCount}</LanguageOverflowBubble>
          )}
        </s.LanguagesMeta>
      )}
      {actions && <s.ActionsContainer>{actions}</s.ActionsContainer>}
    </s.FriendRowLi>
  );
}
