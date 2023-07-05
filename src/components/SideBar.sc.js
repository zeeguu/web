import styled, { css } from "styled-components";

// The twistedness here is the fact that in the
// mobile and the desktop version have inverted
// initial state:
//   Desktop = initially open, and
//   Mobile = initiallly closed

let arrowSize = "80px";

let sideBarWidthDesktop = "13.9em";

let mainPageContentCommon = css`
  position: fixed;
  top: 0;
  overflow-y: scroll;
  height: 100vh;
  padding-bottom: 6px;
  padding-left: 6px;
  padding-right: 6px;
  overflow-x: hidden;
`;

const MainContentInitial = styled.div`
  /* Default (Minimized) on Mobile */

  /* margin-left: 1em;
  margin-top: 1em; */
  margin-bottom: 1em;
  right: 0.1em;
  left: 1em;
  ${mainPageContentCommon}

  @media (min-width: 768px) {
    /* Default (Open) on Desktop */
    left: ${sideBarWidthDesktop};
    right: 0.1em;
  }
`;

const MainContentToggled = styled.div`
  ${mainPageContentCommon}

  /* Toggled (Open) on Mobile  */
  left: 10em;
  right: 0.1em;

  @media (min-width: 768px) {
    /* Toggled (Minimized) on Desktop */
    margin-left: 2em;
    right: 0.1em;
    left: 1em;
  }
`;

const sidebarCommon = css`
  position: fixed;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.light};
`;

const logoOpen = css`
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

const arrowCommon = css`
  .arrowHolder {
    font-weight: 100;
    cursor: pointer;
    font-size: ${arrowSize};
  }
`;

const arrowPointsToRight = css`
  .arrowHolder {
    display: flex;
    flex-direction: row-reverse;

    .toggleArrow {
      color: ${(props) => props.dark};
      z-index: 100;
      transform: rotate(90deg) translate(20px, -0.5em);
    }
  }
`;

const arrowAsNegativeSpace = css`
  .arrowHolder {
    display: flex;
    flex-direction: row-reverse;

    .toggleArrow {
      color: white;
      transform: rotate(-90deg) translate(10px, 10px);
    }
  }
`;

const sidebarMinimizedCommon = css`
  width: 0px;

  .logo {
    display: none;
  }

  .navigationLink {
    display: none;
  }
`;

const navigationVisibleCommon = css`
  .navigationLink {
    display: block;
    color: white;
    margin-bottom: 0.4em;
    background-color: ${(props) => props.dark};

    a {
      color: white;
      text-decoration: none;
      padding-left: 10px;
      display: flex;
      align-items: center;
    }
  }
`;

const SideBarInitial = styled.div`
  // Mobile - Initial = Closed
  ${sidebarCommon}

  ${sidebarMinimizedCommon}

  /*  Arrow */
  ${arrowCommon}
  ${arrowPointsToRight}

  //   Default for Desktop = Open
  @media (min-width: 768px) {
    width: 14em;

    /* Logo */
    ${logoOpen}

    /* Arrow */
    ${arrowAsNegativeSpace}

    /* Navigation */
    ${navigationVisibleCommon}
    .navigationLink {
      font-size: xx-large;
    }
  }
`;

const SideBarToggled = styled.div`
  ${sidebarCommon}

  // Mobile - Open
  width: 10em;

  ${logoOpen}

  ${arrowCommon}

  ${arrowAsNegativeSpace}

  ${navigationVisibleCommon}
  .navigationLink {
    font-weight: 700;
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    font-size: large;
  }

  @media (min-width: 768px) {
    ${sidebarMinimizedCommon}
    ${arrowPointsToRight}
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

export {
  SideBarInitial,
  SideBarToggled,
  MainContentInitial,
  MainContentToggled,
  SettingsWithLogOut,
  Sidebar,
};
