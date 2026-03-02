import styled from "styled-components";
import { sideNavCollapsedWidth, sideNavExpandedWidth } from "./components/MainNav/SideNav/SideNav.sc";
import { MEDIUM_WIDTH, MOBILE_WIDTH } from "./components/MainNav/screenSize";
import { PAGES_WITHOUT_BOTTOM_NAV } from "./components/MainNav/BottomNav/pagesWithoutBottomNav";
import { FOOTER_HEIGHT } from "./components/MainNav/BottomNav/BottomNav.sc";

const MainNavWithComponent = styled.div`
  box-sizing: border-box;
  top: 0;
  height: ${({ $screenWidth, $currentPath }) => {
    if ($screenWidth <= MOBILE_WIDTH && PAGES_WITHOUT_BOTTOM_NAV.some((page) => $currentPath.startsWith(page))) {
      return "100%";
    } else if ($screenWidth <= MOBILE_WIDTH) {
      return "calc(100% - 4rem - env(safe-area-inset-bottom, 0px))";
    } else {
      return "100%";
    }
  }};
  display: flex;
  justify-content: space-around;
  flex-direction: ${({ $screenWidth }) => ($screenWidth <= MOBILE_WIDTH ? "column" : "row")};
  overflow: hidden;
`;

const AppContent = styled.section`
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
  transition: 0.3s ease-in-out;
  padding: 0 0.2rem 0.2rem 0.2rem;
  overflow-x: hidden;
  overflow-y: auto;
  top: 0;

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

export { MainNavWithComponent, AppContent };
