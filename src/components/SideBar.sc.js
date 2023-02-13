import styled, { css } from "styled-components";
import { blueDark, iconsGray, zeeguuSecondOrange } from "./colors";

// The twistedness here is the fact that in the
// mobile and the desktop version have inverted
// initial state:
//   Desktop = initially open, and
//   Mobile = initiallly closed

let arrowSize = "60px";

let mainPageContentCommon = css`
  top: 0;
  height: 100%;
  overflow-x: hidden;
`;

const MainContentInitial = styled.div`
  overflow-y: hidden;
  width: 99%;

  @media (min-width: 768px) {
    width: calc(100% - 160px);
  }
  ${mainPageContentCommon}
`;

const MainContent = styled.div`
  margin-bottom: 1em;
  padding: 20px 10px;
  ${mainPageContentCommon}
  @media(min-width: 768 px) {
    padding: 24px 10px;

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
    display: flex;
    align-items: center;
    color: ${iconsGray};
    padding: 14px 0 14px 12px;
    font-size: medium;

    :hover {
      background-color: ${blueDark};
    }

    span {
      align-self: flex-end;
    }

    svg {
      margin-bottom: 2px;
    }

    a {
      color: ${iconsGray};
      text-decoration: none;
      padding-left: 10px;
      display: flex;
      align-items: flex-end;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 12px 0 0 12px;

    & a {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 100%;
      color: white;
      display: flex;
      align-items: center;

      & span {
        align-self: center;
        margin-left: 5px;
      }
    }

    img {
      width: 20px;
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
  width: 160px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => props.light};
  position: absolute;
  left: -160px;
  z-index: 10;

  .arrowHolder {
    display: flex;
    flex-direction: row-reverse;
    color: ${(props) => props.light};
    cursor: pointer;
    user-select: none;

    @media (min-width: 768px) {
      pointer-events: none;
      cursor: default;
    }

    .arrow {
      transform: rotate(90deg) translate(-8px, -0.5em);
      user-select: none;
    }

    .toggleArrow {
      color: white;
      transform: rotate(-90deg) translate(10px, 10px);
    }
  }

  @media (min-width: 768px) {
    position: relative;
    left: 0 !important;
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
