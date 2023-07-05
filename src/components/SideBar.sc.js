import styled, { css } from "styled-components";
import { blueDark, iconsGray } from "./colors";

// The twistedness here is the fact that in the
// mobile and the desktop version have inverted
// initial state:
//   Desktop = initially open, and
//   Mobile = initiallly closed

let mainPageContentCommon = css`
  top: 0;
  height: 100%;
  overflow-x: hidden;
`;

const MainContentInitial = styled.div`
  overflow-y: hidden;
  width: 99%;
  padding-top: 20px;

  @media (min-width: 768px) {
    width: calc(100% - 160px);
  }
  ${mainPageContentCommon}
`;

const MainContent = styled.div`
  margin-bottom: 1em;
  padding: 20px 10px;
  ${mainPageContentCommon};
  @media (min-width: 768px) {
    padding: 24px 10px;

    width: 100%;
    margin: auto;
  }
`;

const SideBarInitial = styled.div`
  width: 100%;
  flex-direction: row;
  overflow: hidden;
  position: fixed;
  height: 100%;
  display: flex;

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
    width: 100px;
    align-self: center;
    margin: 16px 0 50px 12px;

    @media (min-width: 768px) {
      width: 100%;
      margin: 16px 0 50px 12px;
    }

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
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => props.light};
  position: absolute;
  left: -100%;
  z-index: 10;
  transition: all 450ms ease-in-out 0s;

  @media (min-width: 768px) {
    position: relative;
    left: 0 !important;
    width: 160px;
  }
`;

const SideBarMenuIconContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
  @media (min-width: 768px) {
    display: none;
  }
`;

export {
  SideBarInitial,
  MainContentInitial,
  SettingsWithLogOut,
  Sidebar,
  SidebarContainer,
  MainContent,
  SideBarMenuIconContainer,
};
