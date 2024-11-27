import styled, { css } from "styled-components";
import { blue700, orange600 } from "../../../colors";

const sharedSidebarStyling = css`
  box-sizing: border-box;
  position: fixed;
  transition: 0.3s ease-in-out;
  width: ${({ isCollapsed }) => (isCollapsed ? "4.5rem" : "14rem")};
  background-color: ${({ isOnStudentSide }) =>
    isOnStudentSide === true ? `${orange600}` : `${blue700}`};

  @media (max-width: 768px) {
    width: 4.5rem;
  }
`;

const SideBar = styled.nav`
  ${sharedSidebarStyling}
  height: 100%;
  top: 0;
  left: 0;
  padding: 0.5rem 0.5rem 11rem 0.5rem;

  overflow-y: scroll;
`;

const BottomSection = styled.div`
  ${sharedSidebarStyling}
  bottom: 0;
  left: 0;
  padding: 1rem 0.5rem 1rem 0.5rem;
`;

export { SideBar, BottomSection };
