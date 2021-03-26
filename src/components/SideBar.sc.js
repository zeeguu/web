import styled, { css } from "styled-components";
import { zeeguuOrange, lightOrange, lightBlue, darkBlue } from "../components/colors";

// The twistedness here is the fact that in the
// mobile and the desktop version have inverted
// initial state:
//   Desktop = initially open, and
//   Mobile = initiallly closed

let arrowSize = "80px";

let sideBarWidthDesktop = "12.5em";

let mainPageContentCommon = css`
  position: fixed;
  top: 0;
  overflow-y: scroll;
  height: 100vh;
  padding: 6px;
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
  left: 7em;
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
  height: 100vh;
  background-color: ${lightOrange};
`;

const sidebarCommonTeacher = css`
  ${sidebarCommon}
  background-color: ${lightBlue};
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
      color: ${zeeguuOrange};
      z-index: 100;
      transform: rotate(90deg) translate(20px, -0.5em);
    }
  }
`;
const arrowPointsToRightTeacher = css`
  ${arrowPointsToRight}
  .arrowHolder{
    .toggleArrow{
      color:${darkBlue};
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
    background-color: ${zeeguuOrange};

    a {
      color: white;
      text-decoration: none;
      padding-left: 10px;
    }
  }
`;

const navigationVisibleCommonTeacher = css`
  ${navigationVisibleCommon}
  .navigationLink {
    background-color: ${darkBlue};
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
const SideBarInitialTeacher = styled.div`
  // Mobile - Initial = Closed
  ${sidebarCommonTeacher}

  ${sidebarMinimizedCommon}

  /*  Arrow */
  ${arrowCommon}
  ${arrowPointsToRightTeacher} 

  //   Default for Desktop = Open
  @media (min-width: 768px) {
    width: 12.5em;

    /* Logo */
    ${logoOpen}

    /* Arrow */
    ${arrowAsNegativeSpace}

    /* Navigation */
    ${navigationVisibleCommonTeacher}
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
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    font-size: large;
  }

  @media (min-width: 768px) {
    ${sidebarMinimizedCommon}
    ${arrowPointsToRight}
  }
`;

const SideBarToggledTeacher = styled.div`
  ${sidebarCommonTeacher}

  // Mobile - Open
  width: 7em;

  ${logoOpen}

  ${arrowCommon}

  ${arrowAsNegativeSpace}

  ${navigationVisibleCommonTeacher}
  .navigationLink {
    font-weight: 700;
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    font-size: large;
  }

  @media (min-width: 768px) {
    ${sidebarMinimizedCommon}
    ${arrowPointsToRightTeacher}
  }
`;
export {
  SideBarInitial,
  SideBarToggled,
  SideBarInitialTeacher,
  SideBarToggledTeacher,
  MainContentInitial,
  MainContentToggled,
};
