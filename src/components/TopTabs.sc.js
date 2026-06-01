import styled from "styled-components";
import { darkGrey, zeeguuOrange } from "./colors";

const TopTabsWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary);
  transition: transform 0.3s ease-in-out;
  padding-top: 0.5em;

  &.header--hidden {
    transform: translateY(-100%);
  }
`;

const TopTabs = styled.div`
  position: relative;

  .all__tabs {
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
    color: var(--onboarding-btn-bg);
  }

  .tab-separator {
    color: #ccc;
    font-size: 1.2em;
    margin: 0 0.3em;
  }
`;

export { TopTabs, TopTabsWrapper };
