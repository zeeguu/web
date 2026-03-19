import styled from "styled-components";

const actionVariantStyles = {
  cancel: {
    lightBg: "#ffe9e7",
    lightBorder: "#f5c4be",
    lightText: "#b4493f",
    darkBg: "#4a2b2b",
    darkBorder: "#8e4747",
    darkText: "#ff9f94",
  },
  add: {
    lightBg: "#e6f5ff",
    lightBorder: "#b7daf6",
    lightText: "#1f6fb2",
    darkBg: "#20364d",
    darkBorder: "#3a628a",
    darkText: "#8bc7ff",
  },
  accept: {
    lightBg: "#e8f8ea",
    lightBorder: "#bbe6c0",
    lightText: "#2d8a4a",
    darkBg: "#223a2b",
    darkBorder: "#3f7c52",
    darkText: "#87d9a0",
  },
  reject: {
    lightBg: "#ffe9e7",
    lightBorder: "#f5c4be",
    lightText: "#b4493f",
    darkBg: "#4a2b2b",
    darkBorder: "#8e4747",
    darkText: "#ff9f94",
  },
};

const actionVariantValue = (variant, tone, fallback) =>
  actionVariantStyles[variant]?.[tone] ?? fallback;

export const FriendRowLi = styled.li`
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.5em 0;
`;

export const FriendIcon = styled.span`
  font-size: 2em;
  color: var(--text-secondary);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

export const FriendName = styled.span`
  font-weight: 600;
`;

export const FriendUsername = styled.span`
  color: var(--text-secondary);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  text-decoration: ${({ $clickable }) => ($clickable ? "underline" : "none")};
`;

export const LanguagesMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
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
  color: #d97f00;
  font-weight: 500;

  :root[data-theme="dark"] & {
    color: #ffb74d;
  }
`;

export const ActionsContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const AlreadyFriends = styled.span`
  color: #2d8a4a;
  display: flex;
  align-items: center;
  gap: 0.4em;

  :root[data-theme="dark"] & {
    color: #87d9a0;
  }
`;

export const RequestSent = styled.span`
  color: #b56b00;

  :root[data-theme="dark"] & {
    color: #ffbb54;
  }
`;

export const ActionButton = styled.button`
  padding: 0.3em 0.8em;
  border-radius: 4px;
  border: 1px solid
    ${({ $variant }) => actionVariantValue($variant, "lightBorder", "var(--border-light)")};
  display: flex;
  align-items: center;
  gap: 0.4em;
  background: ${({ $variant }) => actionVariantValue($variant, "lightBg", "var(--card-bg)")};
  color: ${({ $variant }) => actionVariantValue($variant, "lightText", "var(--text-primary)")};
  cursor: ${({ disabled, $variant }) =>
    disabled || $variant === "accepted" ? "default" : "pointer"};
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s,
    opacity 0.2s;

  &:disabled {
    opacity: 0.8;
  }

  :root[data-theme="dark"] & {
    border-color: ${({ $variant }) => actionVariantValue($variant, "darkBorder", "var(--border-light)")};
    background: ${({ $variant }) => actionVariantValue($variant, "darkBg", "var(--card-bg)")};
    color: ${({ $variant }) => actionVariantValue($variant, "darkText", "var(--text-primary)")};
  }
`;

