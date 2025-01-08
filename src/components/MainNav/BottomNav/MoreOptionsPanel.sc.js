import styled from "styled-components";

const MoreOptionsWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
  animation: ${({ $overlayTransition }) => $overlayTransition} 0.3s ease-in-out
    forwards;
`;

const MoreOptionsPanel = styled.nav`
  opacity: 1;
  background-color: ${({ theme }) => theme.navBg};
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-radius: 1rem 1rem 0 0;
  padding: 1rem 1rem 2rem 1rem;
  box-shadow: 0 -0.25rem 1.25rem rgba(0, 0, 0, 0.1);
  animation: ${({ $moreOptionsTransition }) => $moreOptionsTransition} 0.3s
    ease-in-out forwards;
`;

const CloseSection = styled.div`
  width: 100%;
  display: flex;
`;

const CloseButton = styled.button`
  color: ${({ theme }) => theme.btnContentDefault};
  background-color: ${({ theme }) => theme.btnBgDefault};
  border: none;
  padding: 0;
  margin: 0 0 0 auto;
  cursor: pointer;
`;

export { MoreOptionsWrapper, MoreOptionsPanel, CloseSection, CloseButton };
