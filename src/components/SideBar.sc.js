import styled, { css } from "styled-components";

// The twistedness here is the fact that in the
// mobile and the desktop version have inverted
// initial state:
//   Desktop = initially open, and
//   Mobile = initiallly closed

let arrowSize = "80px";

let mainPageContentCommon = css`
  top: 0;
  overflow-y: scroll;
  height: 100vh;
  overflow-x: hidden;
`;

const MainContentInitial = styled.div`
  margin-bottom: 1em;
  overflow-y: hidden;
  @media (min-width: 768px) {
    width: calc(100% - 230px);
  }
  ${mainPageContentCommon}
`;

const MainContent = styled.div`
  margin-bottom: 1em;
  ${mainPageContentCommon}
  @media(min-width: 768 px) {
    width: 100%;
    margin: auto;
  }
`;

const sidebarCommon = css`
  position: fixed;
  height: 100%;
  display: flex;
`;

const arrowCommon = css`
  .arrowHolder {
    font-weight: 100;
    cursor: pointer;
    font-size: ${arrowSize};
  }
`;

const SideBarInitial = styled.div`
  width: 100%;
  flex-direction: row;
  overflow-y: hidden;

  ${sidebarCommon}
  ${arrowCommon}
  .navigationLink {
    display: block;
    color: white;
    margin-bottom: 0.4em;
    font-size: xx-large;
    background-color: ${(props) => props.dark};

    a {
      color: white;
      text-decoration: none;
      padding-left: 10px;
      display: flex;
      align-items: center;
    }
  }

  .logo {
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 2em;

    img {
      width: 50%;
    }
  }
`;

const SettingsWithLogOut = styled.div`
  justify-self: flex-end;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin-bottom: 0;

  @media (min-width: 768px) {
    margin-bottom: 16px;
  }
`;

const SidebarContainer = styled.div`
  width: 230px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => props.light};

  .arrowHolder {
    display: flex;
    flex-direction: row-reverse;
    transition: 200ms;
    color: ${(props) => props.light};

    .arrow {
      transform: rotate(90deg) translate(-8px, -0.5em);
      user-select: none;
    }

    .toggleArrow {
      color: white;
      transform: rotate(-90deg) translate(10px, 6px);
    }
  }

  @media (max-width: 768px) {
    position: absolute;
    left: -230px;
    z-index: 10;
  }
`;

export {
  SideBarInitial,
  MainContentInitial,
  SettingsWithLogOut,
  Sidebar,
  SidebarContainer,
  MainContent,
};
