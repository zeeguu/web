import styled from "styled-components";
import { darkGrey, zeeguuOrange } from "./colors";

const TopTabs = styled.div`
  h1 {
    font-weight: 300;
    font-size: 3em;
    line-height: 1em;
    letter-spacing: 0.05em; // wider spacing; makes title stand out more
    text-align: center;
    margin-top: 2em;
  }

  .all__tabs {
    line-height: 1.4em;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
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
    .headmenuTab {
      font-size: 1em;
      font-weight: 500;
      line-height: 7ex;
      color: ${darkGrey};
    }

    .headmenuTab.active {
      font-weight: 700;
      color: black;
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
