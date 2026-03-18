import styled from "styled-components";

export const FriendRowLi = styled.li`
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.5em 0;
  flex-wrap: nowrap;
`;

export const FriendIcon = styled.span`
  font-size: 2em;
  flex-shrink: 0;
`;

export const FriendName = styled.span`
  color: var(--text-secondary);
  white-space: nowrap;
`;

export const FriendUsername = styled.span`
  color: var(--text-primary);
  font-weight: 600;
  white-space: nowrap;
`;

export const LanguagesMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  margin-left: auto;
`;

export const LanguageOverflowBubble = styled.button`
  box-sizing: content-box;
  width: 1.2rem;
  height: 1.2rem;
  padding: 0;
  border-radius: 50%;
  background: var(--light-badge-bg);
  border: 0.08rem solid var(--border-light);
  color: var(--text-primary);
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--tag-bg);
  }
`;

export const NoLanguages = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export const LanguagesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const LanguageItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--border-light);
  border-radius: 999px;
  background: var(--card-bg);
`;

export const StreakContainer = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3em;
  color: #ff9800;
  font-weight: 500;
  flex-shrink: 0;
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
      default:
        return "#fff";
    }
  }};
  cursor: ${({ disabled, variant }) =>
    disabled || variant === "accepted" ? "default" : "pointer"};
`;
