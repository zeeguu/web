import styled, { keyframes, css } from "styled-components";

// The twistedness here is the fact that in the
// mobile and the desktop version have inverted
// initial state:
//   Desktop = initially open, and
//   Mobile = initiallly closed

let arrowSize = "80px";

let mainPageContentCommon = css`
  position: fixed;
  top: 0;
  overflow-y: scroll;
  height: 100vh;
  padding: 6px;
`;

const MainContentInitial = styled.div`
  /* Default (Minimized) on Mobile */
  margin-left: 1em;
  ${mainPageContentCommon}

  @media (min-width: 768px) {
    /* Default (Open) on Desktop */
    margin-left: 12.5em;
  }
`;

const MainContentToggled = styled.div`
  ${mainPageContentCommon}

  /* Toggled (Open) on Mobile  */
  margin-left: 7em;

  @media (min-width: 768px) {
    /* Toggled (Minimized) on Desktop */
    margin-left: 2em;
  }
`;

const sidebarCommon = css`
  position: fixed;
  top: 0;
  height: 100vh;
  background-color: #ffbb54;
  background-color: green;
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
      color: blue;
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
    /* font-size: xx-large; */
    margin-bottom: 0.4em;

    a {
      color: white;
      text-decoration: none;
      padding-left: 10px;
    }
  }
`;

const navigation2 = css`
  .navigationLink {
    width: 1em;
    color: white;
    font-size: large;
    margin-top: 1em;
    font-weight: 700;

    a {
      color: white;
      text-decoration: none;
      padding-left: 10px;
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
    width: 12.5em;

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
  width: 7em;

  ${logoOpen}

  ${arrowCommon}

  ${arrowAsNegativeSpace}

  ${navigationVisibleCommon}
  .navigationLink {
    font-weight: 700;
  }

  @media (min-width: 768px) {
    ${sidebarMinimizedCommon}

    ${arrowPointsToRight}
  }
`;

export {
  SideBarInitial,
  SideBarToggled,
  MainContentInitial,
  MainContentToggled,
};
