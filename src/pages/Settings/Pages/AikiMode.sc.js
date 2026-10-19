import styled from "styled-components";
import { SectionContainer } from "./FeedPreferences.sc";

// Main centres its children, so a card with short text would shrink to fit it;
// on this page the cards stack, and all should be as wide as the page.
export const AikiCard = styled(SectionContainer)`
  align-self: stretch;
`;
