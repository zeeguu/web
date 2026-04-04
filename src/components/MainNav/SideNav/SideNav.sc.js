import styled from "styled-components";
import { MEDIUM_WIDTH } from "../screenSize";

const sideNavExpandedWidth = "14rem";
const sideNavCollapsedWidth = "4.2rem";

const NavList = styled.ul`
  all: unset;
`;

const BottomSection = styled.div`
  flex-shrink: 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.navBg};
  padding: 1rem 0;
`;

const SideNav = styled.nav`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.navBg};
  transition: 0.3s ease-in-out;
  overflow: hidden;
  padding: calc(0.5rem + env(safe-area-inset-top)) 0.5rem 0 0.5rem;
  width: ${({ $screenWidth }) =>
    $screenWidth > MEDIUM_WIDTH ? sideNavExpandedWidth : sideNavCollapsedWidth};

  > ${NavList} {
    flex-grow: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export {
  SideNav,
  NavList,
  BottomSection,
  sideNavExpandedWidth,
  sideNavCollapsedWidth,
};
