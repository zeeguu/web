import styled, { css } from "styled-components";
import { MEDIUM_WIDTH, MOBILE_WIDTH } from "../screenSize";

const sidebarExpandedWidth = "14rem";
const sidebarCollapsedWidth = "4.2rem";

const sharedSidebarStyling = css`
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.navBg};
  position: fixed;
  left: 0;
  transition: 0.3s ease-in-out;
  overflow-x: hidden;
  width: ${({ $screenWidth }) => {
    if ($screenWidth > MEDIUM_WIDTH) {
      return sidebarExpandedWidth;
    } else if ($screenWidth <= MEDIUM_WIDTH && $screenWidth > MOBILE_WIDTH) {
      return sidebarCollapsedWidth;
    }
  }};
`;

const SideBar = styled.nav`
  height: 100%;
  top: 0;
  padding: 0.5rem 0.5rem 11rem 0.5rem;
  overflow-y: scroll;

  ${sharedSidebarStyling}
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BottomSection = styled.div`
  bottom: 0;
  padding: 1rem 0.5rem 1rem 0.5rem;
  ${sharedSidebarStyling}
`;

export { SideBar, BottomSection, sidebarExpandedWidth, sidebarCollapsedWidth };
