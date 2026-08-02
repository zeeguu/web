import Box from "@mui/material/Box";
import styled, { css, keyframes } from "styled-components";

// Subtle rise-in for the mobile bottom sheet (a gentle nudge up + fade, not a
// full slide — deliberately understated).
const sheetRiseIn = keyframes`
  from { transform: translateY(18px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

//responsible for modal wrapper background, size and scaling
const ModalWrapper = styled(Box)`
  position: absolute;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  max-width: 600px;
  max-height: 80%;
  background-color: ${({ $bg }) => $bg || "var(--card-bg)"};
  border: 0 !important;
  border-radius: 0.65em;
  padding: 32px 48px ${({ $flushBottom }) => ($flushBottom ? "0" : "32px")} 48px;
  box-shadow:
    0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%),
    0px 9px 46px 8px rgb(0 0 0 / 12%);
  outline: none !important;
  overflow: auto;

  p {
    width: 100%;
    line-height: 150%;
    text-align: left;
    font-size: 1rem;
    margin: 0;
  }

  p.small {
    font-size: 0.875rem;
  }

  p.extra-small {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  a {
    text-align: center;
  }

  .link:hover {
    text-decoration: none;
  }

  .annotation {
    color: orange;
    font-weight: 500;
  }

  @media (max-width: 1200px) {
    max-width: 600px;
    width: 80%;
  }

  @media (max-width: 576px) {
    ${({ $bottomSheetOnMobile }) =>
      $bottomSheetOnMobile
        ? `
          top: auto;
          bottom: 0;
          left: 0;
          transform: none;
          width: 100%;
          max-width: 100%;
          max-height: 92%;
          border-radius: 1em 1em 0 0;
          /* No bottom padding: the sticky footer bleeds flush to the sheet's
             bottom edge and provides its own safe-area padding. */
          padding: 20px 16px 0;
        `
        : `
          padding: 20px 16px;
          width: 92%;
        `}
  }

  ${({ $bottomSheetOnMobile, $animateIn }) =>
    $bottomSheetOnMobile &&
    $animateIn &&
    css`
      @media (max-width: 576px) {
        animation: ${sheetRiseIn} 0.18s ease-out;
      }
    `}
`;

const Strong = styled.span`
  margin: 0;
  display: inline;
  font-weight: 700;
`;

const CloseButton = styled.button`
  cursor: pointer;
  padding: 1px;
  text-align: right;
  position: absolute;
  float: right;
  border: none;
  background-color: inherit;
  right: 16px;
  margin-top: -16px;
  @media (max-width: 576px) {
    right: 16px;
    margin-top: -8px;
  }
`;

const ExternalLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

export { ModalWrapper, CloseButton, ExternalLink, Strong };
