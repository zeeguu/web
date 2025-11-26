import styled from "styled-components";
import { darkGrey, zeeguuOrange } from "./colors";

const TopTabs = styled.div`
  position: relative;
  z-index: 10;

  h1 {
    font-weight: 300;
    font-size: 3em;
    line-height: 1em;
    letter-spacing: 0.05em; // wider spacing; makes title stand out more
    text-align: center;
    margin-top: 2em;
  }

  .top-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-direction: column;
    ${({ currentMode }) =>
      currentMode === "swiper" &&
      `
        flex-direction: row;
      `}
  }

  .all__tabs {
    line-height: 1.4em;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }
  .customize {
    align-items: center;
    display: flex;
    width: 100%;
    margin: 0;
    padding-right: 0.1rem;
    padding-bottom: 0.5rem;

    ${({ currentMode }) =>
      currentMode === "swiper"
        ? `
        position: absolute;
        top: 50%;
        left: 1rem;
        transform: translateY(-50%);
        width: auto;
      `
        : `
        position: static;
        width: 100%;
        justify-content: center;
        margin-top: 0.25rem;
      `}
  }

  .headmenuTab {
    font-size: 1.2em;
    font-weight: 400;
    letter-spacing: 0;
  }

  .headmenuTab,
  a {
    text-decoration: none;
    color: black;
  }

  .headmenuTab:hover,
  a:hover {
    color: ${zeeguuOrange};
  }

  .row__bar {
    margin: 0px;
    padding: 1.5em;
  }

  .bar {
    width: 1em;
    height: 0px;
    border: 1px solid ${darkGrey};
    transform: rotate(-90deg);
  }

  /*******MEDIA QUERIES **********/
  @media screen and (max-width: 768px) {
    .customize {
      font-size: 0.8rem;
    }

    .headmenuTab {
      margin-top: 0;
      font-size: 1.0em;
      line-height: 7ex;
    }

    .row__bar {
      padding: 0em;
    }

    .bar {
      width: 1em;
      height: 0px;
      border: 0.5px solid ${darkGrey};
    }
  }

  .is-active {
    font-weight: 600;
  }
`;

export { TopTabs };
