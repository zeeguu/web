import styled, { css } from "styled-components";
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
  background-color: ${orange600};
  color: white;
`;

const BottomNavOption = styled.li`
  box-sizing: border-box;
  list-style: none;
`;

const StyledLink = styled(Link)`
  color: white;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 3rem;
  height: 3rem;
  white-space: nowrap;
  gap: 0.5rem;
`;

export { BottomNav, BottomNavOption, StyledLink };
