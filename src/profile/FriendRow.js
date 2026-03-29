import { useEffect, useState } from "react";
import * as s from "./FriendRow.sc";
import Stack from "@mui/material/Stack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DynamicFlagImage from "../components/DynamicFlagImage";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Heading from "../components/modal_shared/Heading.sc";
import Main from "../components/modal_shared/Main.sc";
import UserBaseInfo from "@/profile/UserBaseInfo";

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
  onViewProfile,
}) {
  const maxVisibleLanguages = 3;
  const resolvedStreak = streak ?? user?.friend_streak ?? 0;
  const friendship = user?.friendship;
  const languages = user?.languages ?? [];
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const visibleLanguages = languages.slice(0, maxVisibleLanguages);
  const overflowCount = languages.length > maxVisibleLanguages ? languages.length - maxVisibleLanguages : 0;
  const languageListLabel = languages
    .map((language) => language.language || language.code)
    .filter(Boolean)
    .join(", ");

  const renderActions = () => {
    if (rowType === "view-only") {
      return null;
    }

    if (rowType === "search") {
      if (friendship && friendship.friend_request_status === "accepted") {
        return (
          <s.AlreadyFriends>
            <PersonIcon sx={{ color: "#2ecc40", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Already friends</span>
          </s.AlreadyFriends>
        );
      }

      if (friendship && friendship.friend_request_status === "pending") {
        if (friendship.sender_id === user?.id) {
          return <s.RequestSent>They sent you a request</s.RequestSent>;
        }
        return (
          <s.ActionButton $variant="cancel" onClick={(event) => onCancelRequest?.(event, user?.id)}>
            <CancelScheduleSendIcon sx={{ color: "#e74c3c", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Cancel</span>
          </s.ActionButton>
        );
      }
      if (isSent) {
        return (
          <s.ActionButton $variant="cancel" onClick={(event) => onCancelRequest?.(event, user?.id)}>
            <CancelScheduleSendIcon sx={{ color: "#e74c3c", fontSize: "1rem", verticalAlign: "middle" }} />
            <span>Cancel</span>
          </s.ActionButton>
        );
      }
      return (
        <s.ActionButton $variant="add" onClick={(event) => onSendRequest?.(event, user?.id)} disabled={isSending}>
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
        </s.ActionButton>
      );
    }

    if (rowType === "request") {
      return (
        <>
          <s.ActionButton $variant="accept" onClick={(event) => onAcceptRequest?.(event, user?.id)} disabled={requestAccepted}>
            {requestAccepted ? (
              <>
                <CheckIcon sx={{ color: "#2ecc40", fontSize: "1rem", verticalAlign: "middle" }} />
                <span>Accepted</span>
              </>
            ) : (
              <>
                <CheckIcon sx={{ color: "#2ecc40", fontSize: "1rem", verticalAlign: "middle" }} />
                <span>Accept</span>
              </>
            )}
          </s.ActionButton>
          {!requestAccepted && (
            <s.ActionButton $variant="reject" onClick={(event) => onRejectRequest?.(event, user?.id)}>
              <ClearIcon sx={{ color: "#e74c3c", fontSize: "1rem", verticalAlign: "middle" }} />
              <span>Reject</span>
            </s.ActionButton>
          )}
        </>
      );
    }

    return null;
  };

  const actions = renderActions();

  return (
    <>
      <s.FriendRowLi onClick={() => onViewProfile?.(user?.id)} $clickable={Boolean(onViewProfile)}>
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

            <span>{resolvedStreak}</span>
          </s.StreakContainer>
        )}
        <UserBaseInfo user={user} />
        {rowType === "friend" && (
          <s.LanguagesMeta title={languageListLabel || "No active languages"}>
            {visibleLanguages.map((entry) => (
              <DynamicFlagImage key={entry.language.id || entry.language.code} languageCode={entry.language.code} />
            ))}
            {overflowCount > 0 && (
              <s.LanguageOverflowBubble type="button" onClick={() => setShowLanguagesModal(true)}>
                +{overflowCount}
              </s.LanguageOverflowBubble>
            )}
            {languages.length === 0 && <s.NoLanguages>-</s.NoLanguages>}
          </s.LanguagesMeta>
        )}
        {actions && <s.ActionsContainer>{actions}</s.ActionsContainer>}
      </s.FriendRowLi>

      {rowType === "friend" && (
        <Modal open={showLanguagesModal} onClose={() => setShowLanguagesModal(false)}>
          <Header>
            <Heading>Active Languages</Heading>
          </Header>
          <Main>
            <s.LanguagesList>
              {languages.map((language) => (
                <s.LanguageItem key={language.id || language.code}>
                  {language.code && <DynamicFlagImage languageCode={language.code} />}
                  <span>{language.language || language.code || "Unknown"}</span>
                </s.LanguageItem>
              ))}
            </s.LanguagesList>
          </Main>
        </Modal>
      )}
    </>
  );
}
