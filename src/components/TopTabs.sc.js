import styled from "styled-components";
import { darkGrey, zeeguuOrange } from "./colors";

const TopTabsWrapper = styled.div`
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  transition: transform 0.3s ease-in-out;
  padding-top: 0.5em;

  /* On mobile the row gets its air from .headmenuTab's 7ex line-height;
     desktop has no such line-height, so give the bar room explicitly. */
  @media (min-width: 769px) {
    padding-top: 1.5em;
    padding-bottom: 0.5em;
  }

  &.header--hidden {
    transform: translateY(-100%);
  }
`;

const TopTabs = styled.div`
  position: relative;

  .all__tabs {
    line-height: 1.4em;
    /* Row height lives here, NOT in the separator's padding — otherwise
       single-tab pages (no separator) render a visibly shorter bar. */
    min-height: 3em;
    width: fit-content;
    align-items: center;
    display: flex;
    justify-content: center;
    gap: 0.8em;
    padding: 0rem 1rem;
    border-radius: 1rem;
    margin: 0 auto;
    margin-top: 0.5em;
  }

  .all__tabs--compact {
    min-height: auto;
    padding: 0 0.75rem;
    gap: 1.25em;
    font-size: 0.9em;
  }

  .all__tabs--with-bg {
    background-color: var(--infobox-bg);
  }

  .headmenuTab {
    font-size: 1.2em;
    font-weight: 400;
    letter-spacing: 0;
    display: flex;
    align-items: center;
    color: var(--text-primary);
  }

  .headmenuTab.active {
    color: var(--text-primary);
    font-weight: 600;
  }

  /* Scoped to devices with a real hover capability. On iOS (and any
     touch-only device) :hover styles trigger sticky-hover: the first
     tap paints the hover color and *swallows* the click; a second tap
     is needed to actually navigate. Gating on (hover: hover) means
     these styles simply don't exist on touch devices. */
  @media (hover: hover) {
    .headmenuTab:hover,
    a:hover {
      color: ${zeeguuOrange};
    }
  }

  .row__bar {
    margin: 0px;
    /* Horizontal spacing only — vertical padding here would set the row
       height for multi-tab pages and desync them from single-tab ones. */
    padding: 0 1.5em;
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
      color: var(--text-muted);
    }

    .headmenuTab.active {
      font-weight: 700;
      color: var(--text-primary);
    }
  }

  .is-active {
    font-weight: 600;
  }

  /* Icon-only tabs can't show "bolder when active" — make the active SVG
     orange so the user gets a visible "you're here" cue. */
  .headmenuTab.active svg {
    color: ${zeeguuOrange};
  }

  /* Home icon styling - black when inactive, orange fill when active */
  .headmenuTab.icon-inactive svg {
    color: gray;
  }

  .headmenuTab.icon-active svg {
    color: ${zeeguuOrange};
  }

  .tab-separator {
    color: #ccc;
    font-size: 1.2em;
    margin: 0 0.3em;
  }
`;

export { TopTabs, TopTabsWrapper };
