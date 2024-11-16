import styled from "styled-components";

const SideBar = styled.nav`
  box-sizing: border-box;
  height: 100%;
  background-color: #ffa41a;
  padding: 0.5rem;
  width: 14rem;
  overflow-y: scroll;
  display: block;
  position: fixed;
  top: 0;
  transition: 0.3s ease-in-out;
`;

const LogoLink = styled.li`
  box-sizing: border-box;
  width: 100%;
  list-style-type: none;
  font-size: 1rem;
  color: white;
  font-weight: 600;
  border-radius: 0.25rem;
  border: solid 0.1rem transparent;
  transition: 0.3s ease-in-out;
  cursor: pointer;

  a {
    font: inherit;
    color: inherit;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0.75rem 1.5rem 0.75rem;
  }
`;

const Logotype = styled.span`
  font-size: 1.5rem;
  color: white;
  font-weight: 500;
`;

export { SideBar, LogoLink, Logotype };
