import styled, { keyframes, css } from "styled-components";

let arrowSize = "80px";

let mainPageContentCommon = css`
  position: fixed;
  top: 0;
  overflow-y: scroll;
  height: 100vh;
  padding: 6px;
`;

const MainPageContentDefault = styled.div`
  /* Default (Minimized) on Mobile */
  margin-left: 1em;
  ${mainPageContentCommon}

  @media (min-width: 768px) {
    /* Default (Open) on Desktop */
    margin-left: 12.5em;
  }
`;

const MainPageContentToggled = styled.div`
  ${mainPageContentCommon}

  /* Toggled (Open) on Mobile  */
  margin-left: 7em;

  @media (min-width: 768px) {
    /* Toggled (Minimized) on Desktop */
    margin-left: 2em;
  }
`;

const SideBarDefault = styled.div`
  // Mobile - Default
  position: fixed;
  width: 0em;
  top: 0;
  height: 100vh;
  background-color: #ffbb54;

  .logo {
    display: none;
  }

  .arrowHolder {
    display: flex;
    flex-direction: row-reverse;
    font-weight: 100;
    cursor: pointer;

    .toggleArrow {
      font-size: ${arrowSize};
      color: orange;
      z-index: 100;
      transform: rotate(90deg) translate(20px, -0.5em);
    }
  }

  .navigationLink {
    display: none;
  }

  //   Default for Desktop
  @media (min-width: 768px) {
    position: fixed;
    width: 12.5em;

    .logo {
      display: block;
      text-align: center;
      width: 100%;
      margin-top: 1em;
    }

    .arrowHolder {
      display: flex;
      width: 12.5em;
      flex-direction: row-reverse;

      .toggleArrow {
        color: white;
        /* color: lightcoral; */
        transform: rotate(-90deg) translate(10px, 10px);
      }
    }

    .navigationLink {
      display: block;
      background-color: green;
      width: 1em;
      color: white;
      font-size: xx-large;
      margin-bottom: 0.4em;

      a {
        color: white;
        text-decoration: none;
        padding-left: 10px;
      }
    }
  }
`;

const SideBarToggled = styled.div`
  // Mobile - Toggled
  top: 0px;
  position: fixed;
  width: 7em;
  height: 100vh;
  background-color: #ffbb54;

  .logo {
    // background-color: green;
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 2em;
  }

  .arrowHolder {
    display: flex;
    flex-direction: row-reverse;
    font-weight: 100;
    // background-color: green;
    /* z-index: 1000; */

    .toggleArrow {
      font-size: ${arrowSize};
      color: white;

      transform: rotate(-90deg) translate(20px, 8px);
    }
  }

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

  @media (min-width: 768px) {
    width: 0px;

    .navigationLink {
      display: none;
    }

    .logo {
      display: none;
    }

    .arrowHolder {
      position: fixed;
      display: flex;
      flex-direction: row-reverse;

      .toggleArrow {
        color: orange;
        transform: rotate(90deg) translate(10px, 10px);
      }
    }
  }
`;

export {
  SideBarDefault,
  SideBarToggled,
  MainPageContentDefault,
  MainPageContentToggled,
};
