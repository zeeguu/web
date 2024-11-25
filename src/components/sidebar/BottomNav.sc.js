import styled from "styled-components";
import { blue700, orange600 } from "../colors";
import { Link } from "react-router-dom/cjs/react-router-dom";

const BottomNav = styled.nav`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  padding: 1rem;
  background-color: ${({ isOnStudentSide }) =>
    isOnStudentSide ? `${orange600}` : `${blue700}`};
  color: white;
  z-index: 1;
  transition: 0.3s ease-in-out;
`;

const BottomNavOption = styled.li`
  box-sizing: border-box;
  list-style: none;
`;

const StyledLink = styled(Link)`
  color: white;
  font-size: 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 4rem;
  height: 3rem;
  white-space: nowrap;
  gap: 0.5rem;
`;

export { BottomNav, BottomNavOption, StyledLink };
