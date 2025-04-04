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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  padding: 6rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 62rem;
  gap: 1.5rem;

  @media (max-width: 576px) {
    padding: 3rem 1rem;
  }

  h1 {
    ${_mainHeader}
    color: ${almostBlack};
    font-size: 3rem;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p.hero-paragraph {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 150%;
    color: ${almostBlack};
  }
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  padding: 3rem 0 0 0;
  min-height: 11rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 2rem 0 0 0;
  }
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
  LanguageGrid,
  AdaptableColumn,
  PaleAdaptableColumn,
  DescriptionText,
  CenterText,
};
