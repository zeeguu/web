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

// Unread marker: a dot pinned to the top-right, in the same column as the ×
// (which is itself absolutely positioned). Keeping it out of the flex flow means
// it doesn't shift the row, so thumbnails stay aligned with the Saves list.
// Same orange as the tab badge, so "orange = unread" reads as one language.
export const UnreadDot = styled.span`
  position: absolute;
  top: 0.9em;
  right: 0.8em;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${orange500};
`;
