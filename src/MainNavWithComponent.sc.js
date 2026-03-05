import styled from "styled-components";
import { sideNavCollapsedWidth, sideNavExpandedWidth } from "./components/MainNav/SideNav/SideNav.sc";
import { MEDIUM_WIDTH, MOBILE_WIDTH } from "./components/MainNav/screenSize";

const MainNavWithComponent = styled.div`
  box-sizing: border-box;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const NavArea = styled.div`
  flex-shrink: 0;
`;

const AppContent = styled.section`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 0.2rem 0 0.2rem;
  
  margin-left: ${({ $screenWidth }) => {
    if ($screenWidth > MEDIUM_WIDTH) {
      return sideNavExpandedWidth;
    } else if ($screenWidth <= MEDIUM_WIDTH && $screenWidth > MOBILE_WIDTH) {
      return sideNavCollapsedWidth;
    } else {
      return "0px";
    }
  }};
`;

export { MainNavWithComponent, NavArea, AppContent };
