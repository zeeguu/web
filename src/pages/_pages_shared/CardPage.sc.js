import styled, { css } from "styled-components";
import { zeeguuOrange } from "../../components/colors";

const PageBackdrop = styled.div`
  position: ${({ $isBackgroundFixed }) => ($isBackgroundFixed ? "fixed" : "static")};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--prefs-page-bg, ${zeeguuOrange});
  overflow: hidden;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: var(--safe-area-bottom, env(safe-area-inset-bottom, 0px));

  .bold {
    font-weight: 600;
  }

  .underlined-link {
    text-decoration: underline;
  }

  ${({ $layoutVariant }) =>
    $layoutVariant === "card-under-menu" &&
    css`
      width: 100%;
      min-height: auto;
      background: none;
      justify-content: flex-start;
      overflow-x: hidden;
      /* This variant is always position: static, so it flows inside <body>,
         which already applies padding-top: env(safe-area-inset-top) (index.css).
         The base PageBackdrop's own safe-area padding-top would double-count it
         and leave a notch-sized gap on iOS (invisible in browsers where env()=0).
         The fixed-background variants escape <body> padding and keep theirs. */
      padding-top: 0;
    `}
`;

const ContentCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  max-width: 80%;
  max-height: 85%;
  border-radius: 1em;

  width: 47rem;
  padding: ${({ $reducedPadding }) => ($reducedPadding ? "1rem 2rem" : "2rem 6rem")};
  margin: 1rem;
  overflow-y: auto;

  background-color: ${({ $isTransparent }) => ($isTransparent ? "transparent" : "var(--card-bg)")};

  @media (max-width: 1200px) {
    padding: ${({ $reducedPadding }) => ($reducedPadding ? "1rem 1.5rem" : "2rem 4.25rem")};
    margin: 0.5rem;
    max-width: 47rem;
    width: 80%;
  }

  @media (max-width: 768px) {
    padding: ${({ $reducedPadding }) => ($reducedPadding ? "1rem 1rem" : "2rem 2rem")};
  }

  @media (max-width: 576px) {
    padding: ${({ $reducedPadding }) => ($reducedPadding ? "0.75rem" : "1.5rem")};
    width: 95%;
  }

  ${({ $pageWidth }) =>
    $pageWidth === "narrow" &&
    css`
      width: 38rem;
      @media (max-width: 1200px) {
        max-width: 38rem;
      }
    `}

  ${({ $layoutVariant }) =>
    $layoutVariant === "card-under-menu" &&
    css`
      @media (max-width: 1200px) {
        margin: 1rem;
      }
      @media (max-width: 576px) {
        width: calc(100% - 2em);
        padding: 1em;
        margin: 1rem 1em 0 1em;
      }
    `}
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  p {
    width: 100%;
    font-size: 0.9em;
    margin: 0;
  }

  p.centered {
    text-align: center;
  }
`;

export { ContentWrapper, ContentCard, PageBackdrop };
