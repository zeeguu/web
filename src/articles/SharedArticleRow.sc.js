import styled from "styled-components";
import { orange500 } from "../components/colors";
import { Row as SavedRow, Title as SavedTitle } from "./SavedArticleRow.sc";

// Top breathing room so the first shared row isn't jammed right under the tab bar.
export const InboxList = styled.div`
  padding-top: 1rem;
`;

// Unread is signalled by the bold title + trailing dot alone — read rows stay
// at full strength (no dimming), so the list doesn't look half-disabled.
export const Row = styled(SavedRow)`
  cursor: pointer;
`;

// Bold title = unread. The strongest, most familiar read/unread cue.
export const Title = styled(SavedTitle)`
  ${(p) => p.$unread && "font-weight: 700;"}
`;

// Unread marker: a small dot trailing the title, inline on the title's
// baseline. Reads as "this one's new" right where the eye already is, instead
// of floating in the top-right corner. Same orange as the tab badge, so
// "orange = unread" is one visual language. flex-shrink:0 keeps it round if the
// title is long; the leading margin gives it a little breathing room.
export const UnreadDot = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-left: 0.45em;
  border-radius: 50%;
  background: ${orange500};
  vertical-align: middle;
`;
