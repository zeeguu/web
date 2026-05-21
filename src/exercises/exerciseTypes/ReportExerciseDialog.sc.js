import styled from "styled-components";

// Plain underlined-text affordance used for tertiary actions: the toast's
// Undo, the dialog's "Skip without reporting", etc. Looks like a link,
// behaves like a button.
export const TextLinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  color: ${(props) => props.$muted ? "#888" : "inherit"};
  font-weight: ${(props) => (props.$muted ? 400 : 600)};
  font-size: 0.85rem;
  text-decoration: underline;
`;

export const UndoToastRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const SkipSeparator = styled.div`
  margin-top: 1.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
`;
