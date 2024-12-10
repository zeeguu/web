import styled from "styled-components";
import {
  sidebarCollapsedWidth,
  sidebarExpandedWidth,
} from "./components/MainNav/SideBar/Sidebar.sc";

const AppWithMainNav = styled.div`
  box-sizing: border-box;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const AppContent = styled.section`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  transition: 0.3s ease-in-out;
  padding: 0 1rem 0 1rem;
  margin-left: ${sidebarExpandedWidth};
  overflow-x: hidden;
  top: 0;

  margin-left: ${({ $screenWidth }) => {
    if ($screenWidth > 992) {
      return sidebarExpandedWidth;
    } else if ($screenWidth <= 992 && $screenWidth > 700) {
      return sidebarCollapsedWidth;
    } else {
      return "0px";
    }
  }};

  padding-bottom: ${({ $screenWidth }) => ($screenWidth <= 700 ? "4rem" : "0")};
`;

export { AppWithMainNav, AppContent };
