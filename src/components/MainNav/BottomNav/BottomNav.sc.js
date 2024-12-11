import styled from "styled-components";
import { slideIn, slideOut } from "../../transitions";
import { BgColorsTheme } from "../SideBar/Sidebar.sc";

const BottomNav = styled.nav`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  padding: 0.5rem 1rem 1rem 1rem;
  ${BgColorsTheme};
  color: white;
  z-index: 1;
  transition: 0.3s ease-in-out;
  animation: ${({ $bottomNavTransition }) =>
      $bottomNavTransition === "slideIn" ? slideIn : slideOut}
    0.3s ease-in-out forwards;
`;

export { BottomNav };
