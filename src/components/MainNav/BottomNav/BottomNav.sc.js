import styled from "styled-components";

const BottomNav = styled.nav`
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 0.5rem 1rem 0.5rem 1rem;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
  background-color: ${({ theme }) => theme.navBg};
  z-index: 2;
  transition: 0.3s ease-in-out;
  animation: ${({ $bottomNavTransition }) => $bottomNavTransition} 0.3s ease-in-out forwards;
`;

const NavList = styled.ul`
  all: unset;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export { BottomNav, NavList };
