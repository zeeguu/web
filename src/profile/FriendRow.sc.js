import styled from "styled-components";

export const FriendRowLi = styled.li`
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.5em 0;
`;

export const FriendIcon = styled.span`
  font-size: 2em;
`;

export const FriendName = styled.span`
  font-weight: 600;
`;

export const FriendUsername = styled.span`
  color: gray;
`;

export const StreakContainer = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3em;
  color: #ff9800;
  font-weight: 500;
`;

export const ActionsContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const AlreadyFriends = styled.span`
  color: green;
  display: flex;
  align-items: center;
  gap: 0.4em;
`;

export const RequestSent = styled.span`
  color: orange;
`;

export const ActionButton = styled.button`
  padding: 0.3em 0.8em;
  border-radius: 4px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  gap: 0.4em;
  cursor: pointer;
  background: ${({ variant }) => {
    switch (variant) {
      case "cancel":
        return "#ffe0e0";
      case "add":
        return "#e0f7fa";
      case "accept":
        return "#e0ffe0";
      case "reject":
        return "#ffe0e0";
      case "unfriend":
        return "#ffe0e0";
      default:
        return "#fff";
    }
  }};
  cursor: ${({ disabled, variant }) =>
    disabled || variant === "accepted" ? "default" : "pointer"};
`;

export const UnfriendSpan = styled.span`
  margin-left: 0.4em;
`;
