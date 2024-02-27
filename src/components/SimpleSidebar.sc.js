import styled, { css } from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: nowrap; /* Ensure elements stay in a row */
`;
const Sidebar = styled.div`
  width: 12em;

  //background-color: rgba(0, 0, 238, 0.02);
  margin-bottom: 1em;
  height: 100vh;

  right: 0.1em;

  .logo {
    margin-bottom: 1em;
    padding: 1em;
  }

  @media (max-width: 600px) {
    width: 2.5em;
    margin-right: 1em;

    .logo {
      width: 1em;
      margin-bottom: 2em;
      padding: 1em;
    }
  }

  .icon {
    width: 1em;
  }

  .selectedIcon {
    width: 1.4em;
    margin-bottom: -0.4em;
  }

  .active {
    background-color: rgb(255, 223, 143);
  }
`;

const MainContent = styled.div`
  flex: 11;
`;

const NavLink = styled.div`
  font-size: large;
  padding: 0.5em;

  a {
    color: #444444;
  }
`;

const MenuText = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
  display: inline;
  margin-left: 0.5em;
`;

export { Sidebar, FlexContainer, MainContent, NavLink, MenuText };
