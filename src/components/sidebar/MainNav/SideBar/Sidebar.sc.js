import styled, { css } from "styled-components";
import { blue700, orange600 } from "../../../colors";

const BgColors = css`
  background-color: ${({ isOnStudentSide }) =>
    isOnStudentSide === true ? `${orange600}` : `${blue700}`};
`;

const sharedSidebarStyling = css`
  box-sizing: border-box;
  position: fixed;
  left: 0;
  transition: 0.3s ease-in-out;
  overflow-x: hidden;
  width: ${({ isCollapsed }) => (isCollapsed ? "4.2rem" : "14rem")};
  ${BgColors}

  @media (max-width: 992px) {
    width: 4.2rem;
  }
`;

const SideBar = styled.nav`
  height: 100%;
  top: 0;
  padding: 0.5rem 0.5rem 11rem 0.5rem;
  overflow-y: scroll;
  ${sharedSidebarStyling}
`;

const BottomSection = styled.div`
  bottom: 0;
  padding: 1rem 0.5rem 1rem 0.5rem;
  position: fixed;
  ${sharedSidebarStyling}
`;

export { SideBar, BottomSection };
