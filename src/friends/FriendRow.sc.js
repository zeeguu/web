import styled from "styled-components";

const actionVariantStyles = {
  add: {
    lightBg: "#e6f5ff",
    lightBorder: "#b7daf6",
    lightText: "#1f6fb2",
    darkBg: "#20364d",
    darkBorder: "#3a628a",
    darkText: "#8bc7ff",
  },
  cancel: {
    lightBg: "#ffe9e7",
    lightBorder: "#f5c4be",
    lightText: "#b4493f",
    darkBg: "#4a2b2b",
    darkBorder: "#8e4747",
    darkText: "#ff9f94",
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

const actionVariantValue = (variant, tone, fallback) => actionVariantStyles[variant]?.[tone] ?? fallback;

export const FriendRowLi = styled.li`
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.5em 0;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover:not(:has(button:hover)) {
    background: var(--row-hover-bg);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const LanguagesMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: auto;
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

export const FriendActionButton = styled.button`
  font-size: 0.9rem;
  padding: 0.5em 0.8em;
  border-radius: 4px;
  border: 1px solid ${({ $variant }) => actionVariantValue($variant, "lightBorder", "var(--border-light)")};
  display: flex;
  align-items: center;
  gap: 0.4em;
  background: ${({ $variant }) => actionVariantValue($variant, "lightBg", "var(--card-bg)")};
  color: ${({ $variant }) => actionVariantValue($variant, "lightText", "var(--text-primary)")};
  cursor: ${({ disabled, $variant }) => (disabled || $variant === "accepted" ? "default" : "pointer")};
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s,
    opacity 0.2s;

  &:disabled {
    opacity: 0.8;
  }

  &:hover:not(:disabled) {
    filter: brightness(95%);
  }

  :root[data-theme="dark"] & {
    border-color: ${({ $variant }) => actionVariantValue($variant, "darkBorder", "var(--border-light)")};
    background: ${({ $variant }) => actionVariantValue($variant, "darkBg", "var(--card-bg)")};
    color: ${({ $variant }) => actionVariantValue($variant, "darkText", "var(--text-primary)")};
  }
`;
