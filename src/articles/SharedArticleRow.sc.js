import styled from "styled-components";
import { orange500 } from "../components/colors";
import { Row as SavedRow, Title as SavedTitle } from "./SavedArticleRow.sc";

// Read rows recede so the unread ones pop — the email-inbox convention.
export const Row = styled(SavedRow)`
  cursor: pointer;
  opacity: ${(p) => (p.$read ? 0.6 : 1)};
`;

// Bold title = unread. The strongest, most familiar read/unread cue.
export const Title = styled(SavedTitle)`
  ${(p) => p.$unread && "font-weight: 700;"}
`;

// Leading unread marker, aligned in a fixed gutter so read/unread rows stay
// aligned. Same orange as the nav badge, so "orange = unread" reads as one
// language across the tab count and the rows.
export const UnreadGutter = styled.div`
  flex-shrink: 0;
  width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UnreadDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${orange500};
`;
