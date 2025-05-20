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

const _sharedFlexColumn = css`
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  ${_sharedFlexColumn}
  align-items: center;
  height: auto;
  max-width: 52rem;
  padding: 6rem 3rem;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 48rem;
  padding: 3rem 0 0 0;
  min-height: 3rem;

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
    line-height: 145%;
    font-size: 1rem;
  }

  @media (min-width: 768px) {
    max-width: 32em;
  }
`;

const PageSectionWrapper = styled.div`
  ${_sharedFlexColumn}
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 5rem 3rem;
  background-color: #fff9f0;

  &:nth-child(odd) {
    background-color: white;
  }

  @media (max-width: 576px) {
    padding: 3rem 1rem;
  }
  p {
    line-height: 150%;
    font-size: 1.2rem;
    color: ${almostBlack};
    font-weight: 500;
  }

  p.subheadline {
    font-size: 1.25rem;
    text-align: center;
  }

  h2 {
    font-size: 2.25rem;
    color: ${almostBlack};
    margin: 0;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.9rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    color: ${almostBlack};
    margin: 0;
  }
`;

const PageSection = styled.section`
  ${_sharedFlexColumn}
  align-items: center;
  max-width: 80rem;
  gap: 1rem;
`;

const Subsection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  width: 100%;
  padding: 5rem 0;

  &:last-child {
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    padding: 3rem 0;
    &:last-child {
      padding-bottom: 0;
    }
  }
`;

const SubsectionText = styled.div`
  flex: 1;
  box-sizing: border-box;
  ${_sharedFlexColumn}
  justify-content: center;
  padding: 0 4rem 0 4rem;
  gap: 1rem;

  @media (max-width: 1200px) {
    padding: 0 2rem 0 2rem;
  }

  @media (max-width: 992px) {
    padding: 0;
    text-align: center;
    max-width: 32rem;
    margin: auto;
  }
`;

const SubsectionImage = styled.img`
  object-fit: cover;
  max-height: 25rem;
  width: 100%;
  height: auto;
  border-radius: 1rem;
  align-self: center;
  aspect-ratio: 2 / 1;

  @media (max-width: 992px) {
    order: 1;
    max-width: 40rem;
    margin: auto;
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
  PageSectionWrapper,
  PageSection,
  SubsectionText,
  SubsectionImage,
  Subsection,
  AdaptableColumn,
  PaleAdaptableColumn,
  DescriptionText,
  CenterText,
};
