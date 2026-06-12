import styled from "styled-components";
import { zeeguuRed } from "../components/colors";

// Config pill, styled like the Discover screen's "Topics: … ⚙" control but with
// theme tokens (not hardcoded white) so it renders as a pill in light AND dark.
export const ConfigPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    border-color 0.15s,
    color 0.15s;

  &:active {
    transform: scale(0.97);
  }
`;

// Small freshness badge next to the date: shown until today's lesson is
// completed. Red so it pops against the orange-heavy screen and reads like a
// "new" notification badge, not just more brand color.
export const NewPill = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 999px;
  color: #fff;
  background: ${zeeguuRed};
  line-height: 1.4;
`;

// Date and metadata container
export const DateLineWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

// Date text styling
export const DateText = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
`;

// Footer container for engagement hints and settings button
export const FooterWrapper = styled.div`
  margin-top: 24px;
  text-align: center;
`;

// Engagement hint and paused message
export const FooterMessage = styled.p`
  margin: 0 0 12px;
  font-size: ${(props) => (props.$small ? "13px" : "14px")};
  color: var(--text-secondary);
`;

// Title wrapper for lesson title
export const LessonTitleWrapper = styled.div`
  margin-top: 8px;
`;
