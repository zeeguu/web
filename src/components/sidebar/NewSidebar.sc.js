import styled from "styled-components";
import { blue700 } from "../colors";

const SideBar = styled.nav`
  box-sizing: border-box;
  height: 100%;
  background-color: #ffa41a;
  background-color: ${(props) =>
    props.isOnStudentSide === true ? "#F09000" : `${blue700}`};
  padding: 0.5rem 0.5rem 11rem 0.5rem;
  width: ${(props) => (props.isCollapsed ? "4.5rem" : "14rem")};
  overflow-y: scroll;
  position: fixed;
  top: 0;
  transition: 0.3s ease-in-out;

  img {
    width: 2rem;
    height: 2rem;
  }

  @media (max-width: 768px) {
    width: 4.5rem;
  }
`;

const BottomSection = styled.div`
  bottom: 0;
  padding: 1rem 0 1rem 0;
  position: fixed;
  width: ${(props) => (props.isCollapsed ? "3.5rem" : "13rem")};
  background-color: ${(props) =>
    props.isOnStudentSide === true ? "#F09000" : `${blue700}`};
  transition: 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 3.5rem;
  }
`;

export { SideBar, BottomSection };
