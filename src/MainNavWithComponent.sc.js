import styled from "styled-components";
import { sideNavCollapsedWidth, sideNavExpandedWidth } from "./components/MainNav/SideNav/SideNav.sc";
import { MEDIUM_WIDTH, MOBILE_WIDTH } from "./components/MainNav/screenSize";
import { PAGES_WITHOUT_BOTTOM_NAV } from "./components/MainNav/BottomNav/pagesWithoutBottomNav";

const MainNavWithComponent = styled.div`
  box-sizing: border-box;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: ${({ $screenWidth }) => ($screenWidth <= MOBILE_WIDTH ? "column" : "row")};
`;

const AppContent = styled.section`
  box-sizing: border-box;
  overflow-y: ${({ $isScrollable }) => ($isScrollable ? "auto" : "hidden")};
  height: 100%;
  width: 100%;
  position: relative;
  transition: 0.3s ease-in-out;
  padding: 0 0.2rem 0 0.2rem;
  overflow-x: hidden;
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

  // Updated margin-bottom because we don't want margin-bottom on pages that don't have the bottom bar
  // To be refactored so that this logic is not repeated and info is retrieved from the navbar's context
  margin-bottom: ${({ $screenWidth, $currentPath }) => {
    if ($screenWidth <= MOBILE_WIDTH && PAGES_WITHOUT_BOTTOM_NAV.some((page) => $currentPath.startsWith(page))) {
      return "0";
    } else if ($screenWidth <= MOBILE_WIDTH) {
      return "4rem";
    } else {
      return "0";
    }
  }};
`;

export { MainNavWithComponent, AppContent };
