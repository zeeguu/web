import styled from "styled-components";
import { MOBILE_WIDTH } from "./components/MainNav/screenSize";

const AppLayout = styled.div`
  box-sizing: border-box;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: ${({ $screenWidth }) => ($screenWidth <= MOBILE_WIDTH ? "column" : "row")};
  overflow: hidden;
`;

const AppContent = styled.section`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;

  /* On mobile the streak header (TopBar) lives inside this scroller, so the
     overlay scrollbar gets drawn across the top of the purple bar — ugly and
     useless on a touch device. Hide it on mobile; desktop keeps its scrollbar. */
  @media (max-width: ${MOBILE_WIDTH}px) {
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export { AppLayout, AppContent };
