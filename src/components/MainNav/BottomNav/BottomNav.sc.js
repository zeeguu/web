import styled from "styled-components";

const BottomNav = styled.nav`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  padding: 0.5rem 1rem 1rem 1rem;
  background-color: ${({ theme }) => theme.navBg};
  z-index: 1;
  transition: 0.3s ease-in-out;
  animation: ${({ $bottomNavTransition }) => $bottomNavTransition} 0.3s
    ease-in-out forwards;
`;

export { BottomNav };
