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
  padding: 0 0.2rem 0 0.2rem;
`;

export { AppLayout, AppContent };
