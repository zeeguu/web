import styled from "styled-components";
import {
  sidebarCollapsedWidth,
  sidebarExpandedWidth,
} from "./components/MainNav/SideBar/Sidebar.sc";
import { MEDIUM_WIDTH, MOBILE_WIDTH } from "./components/MainNav/screenSize";

const AppWithMainNav = styled.div`
  box-sizing: border-box;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: ${({ $screenWidth }) =>
    $screenWidth <= MOBILE_WIDTH ? "column" : "row"};
`;

const AppContent = styled.section`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  transition: 0.3s ease-in-out;
  padding: 0 1rem 0 1rem;
  overflow-x: hidden;
  top: 0;

  margin-left: ${({ $screenWidth }) => {
    if ($screenWidth > MEDIUM_WIDTH) {
      return sidebarExpandedWidth;
    } else if ($screenWidth <= MEDIUM_WIDTH && $screenWidth > MOBILE_WIDTH) {
      return sidebarCollapsedWidth;
    } else {
      return "0px";
    }
  }};

  margin-bottom: ${({ $screenWidth }) => ($screenWidth <= 700 ? "4rem" : "0")};
`;

export { AppWithMainNav, AppContent };
