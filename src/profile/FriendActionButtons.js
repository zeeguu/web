import * as s from "./FriendActionButtons.sc";
import { FriendActionButton } from "../friends/FriendRow.sc";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

export function FriendActionButtons({ isFriendAccepted, pendingFromMe, pendingFromThem, friendActionHandlers }) {
  return (
    <s.FriendActionsContainer>
      {isFriendAccepted && (
        <FriendActionButton $variant="cancel" onClick={friendActionHandlers.onUnfriend}>
          <PersonRemoveIcon sx={{ fontSize: "1rem" }} />
          <span>Unfriend</span>
        </FriendActionButton>
      )}
      {!isFriendAccepted && !pendingFromMe && !pendingFromThem && (
        <FriendActionButton $variant="add" onClick={friendActionHandlers.onAdd}>
          <PersonAddIcon sx={{ fontSize: "1rem" }} />
          <span>Add</span>
        </FriendActionButton>
      )}
      {pendingFromMe && (
        <FriendActionButton $variant="cancel" onClick={friendActionHandlers.onCancel}>
          <CancelScheduleSendIcon sx={{ fontSize: "1rem" }} />
          <span>Cancel</span>
        </FriendActionButton>
      )}
      {pendingFromThem && (
        <>
          <FriendActionButton $variant="accept" onClick={friendActionHandlers.onAccept}>
            <CheckIcon sx={{ fontSize: "1rem" }} />
            <span>Accept</span>
          </FriendActionButton>
          <FriendActionButton $variant="reject" onClick={friendActionHandlers.onReject}>
            <ClearIcon sx={{ fontSize: "1rem" }} />
            <span>Reject</span>
          </FriendActionButton>
        </>
      )}
    </s.FriendActionsContainer>
  );
}
