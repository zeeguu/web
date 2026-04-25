import * as s from "./FriendActionButtons.sc";
import { FriendActionButton } from "../friends/FriendRow.sc";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

export function FriendActionButtons({
  profileData,
  friendship,
  isFriendAccepted,
  friendActionHandlers,
  isPendingFriendAction,
}) {
  const pendingRequestFromMe =
    friendship?.is_accepted === false && friendship?.sender_username !== profileData?.username;
  const pendingRequestFromThem =
    friendship?.is_accepted === false && friendship?.sender_username === profileData?.username;

  return (
    <s.FriendActionsContainer>
      {isFriendAccepted && (
        <FriendActionButton $variant="cancel" onClick={friendActionHandlers.onUnfriend}>
          <PersonRemoveIcon sx={{ fontSize: "1rem" }} />
          <span>Unfriend</span>
        </FriendActionButton>
      )}
      {!isFriendAccepted && !pendingRequestFromMe && !pendingRequestFromThem && (
        <FriendActionButton $variant="add" onClick={friendActionHandlers.onAdd} disabled={isPendingFriendAction}>
          <PersonAddIcon sx={{ fontSize: "1rem" }} />
          <span>Add</span>
        </FriendActionButton>
      )}
      {pendingRequestFromMe && (
        <FriendActionButton $variant="cancel" onClick={friendActionHandlers.onCancel} disabled={isPendingFriendAction}>
          <CancelScheduleSendIcon sx={{ fontSize: "1rem" }} />
          <span>Cancel</span>
        </FriendActionButton>
      )}
      {pendingRequestFromThem && (
        <>
          <FriendActionButton
            $variant="accept"
            onClick={friendActionHandlers.onAccept}
            disabled={isPendingFriendAction}
          >
            <CheckIcon sx={{ fontSize: "1rem" }} />
            <span>Accept</span>
          </FriendActionButton>
          <FriendActionButton
            $variant="reject"
            onClick={friendActionHandlers.onReject}
            disabled={isPendingFriendAction}
          >
            <ClearIcon sx={{ fontSize: "1rem" }} />
            <span>Reject</span>
          </FriendActionButton>
        </>
      )}
    </s.FriendActionsContainer>
  );
}
