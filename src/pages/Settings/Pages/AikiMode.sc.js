import styled from "styled-components";
import { SectionContainer } from "./FeedPreferences.sc";
import { alertGreen } from "../../../components/colors";

// Main centres its children, so a card with short text would shrink to fit it;
// on this page the cards stack, and all should be as wide as the page.
export const AikiCard = styled(SectionContainer)`
  align-self: stretch;
`;

// The "on" / "off" in "Aiki mode is on": bold, and green with a dot while
// apps are paused.
export const AikiState = styled.span`
  font-weight: 700;
  color: ${({ $on }) => ($on ? alertGreen : "var(--text-secondary)")};

  &::before {
    content: ${({ $on }) => ($on ? '"● "' : '""')};
  }
`;

// "Change" after the list of chosen apps: an inline action, so it reads as
// part of the sentence rather than competing with Turn on / Turn off.
export const ChangeLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--text-primary);
  text-decoration: underline;
  cursor: pointer;
`;
