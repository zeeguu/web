import styled, { css } from "styled-components";
import {
  zeeguuOrange,
  zeeguuTransparentLightYellow,
  almostBlack,
} from "../components/colors";

const PageWrapper = styled.div`
  width: 100%;
`;

const Header = styled.header``;

const Main = styled.main`
  position: absolute;
  width: 100%;
  left: 0;
`;

const _mainHeader = css`
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  color: ${zeeguuOrange};
`;

const HeroSection = styled.section`
  height: auto;
  max-width: 52rem;
  padding: 6rem 1rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 76.25rem;
  gap: 1.5rem;

  @media (max-width: 576px) {
    padding: 3rem 1rem;
  }

  h1 {
    ${_mainHeader}
    color: ${almostBlack};
    font-size: 2.5rem;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p.hero-paragraph {
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 150%;
    color: ${almostBlack};
  }
`;

const HeroLeftColumn = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 1.5rem;
  flex: 1;
`;

const HeroRightColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  flex: 1;
  height: 100%;
  padding: 3rem;
`;

const AdaptableColumn = styled.div`
  padding-bottom: 3em;
  height: auto;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  h1 {
    ${_mainHeader}
  }

  h2 {
    margin-top: 1em;
    margin-bottom: -0.5em;
  }

  p {
    line-height: 140%;
  }

  @media (min-width: 768px) {
    max-width: 32em;
  }
`;

const PaleAdaptableColumn = styled(AdaptableColumn)`
  background-color: ${zeeguuTransparentLightYellow};
  padding-top: 0.1em;
`;

const DescriptionText = styled.div`
  text-align: center;
  padding: 1em;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const CenterText = styled.div`
  text-align: center;
`;

export {
  PageWrapper,
  Header,
  Main,
  HeroSection,
  HeroLeftColumn,
  HeroRightColumn,
  AdaptableColumn,
  PaleAdaptableColumn,
  DescriptionText,
  CenterText,
};
