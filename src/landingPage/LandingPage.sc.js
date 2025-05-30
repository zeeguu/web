import styled, { css } from "styled-components";
import { zeeguuOrange, zeeguuTransparentLightYellow, almostBlack } from "../components/colors";

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

const _sharedHeader = css`
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
    ${_sharedHeader}
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
  height: auto;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  h2 {
    ${_sharedHeader}
    margin-top: 0;
  }

  h3 {
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
`;

const PageSection = styled.section`
  ${_sharedFlexColumn}
  align-items: center;
  max-width: 80rem;
  gap: 1rem;

  p {
    line-height: 150%;
    font-size: 1.2rem;
    color: ${almostBlack};
    font-weight: 500;
    margin: 0;
  }

  p.subheadline {
    font-size: 1.25rem;
    text-align: center;

    &.left-aligned {
      text-align: left;

      @media (max-width: 992px) {
        text-align: center;
      }
    }
  }

  h2 {
    font-size: 2.25rem;
    color: ${almostBlack};
    margin: 0;
    text-align: center;

    &.left-aligned {
      text-align: left;

      @media (max-width: 992px) {
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      font-size: 1.9rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    color: ${almostBlack};
    margin: 0;
  }

  ul,
  ol {
    ${_sharedFlexColumn}
    align-items: flex-start;
    gap: 1rem;
    margin-left: 1.5rem;
    width: fit-content;
    padding: 0;

    @media (max-width: 992px) {
      margin: auto;
      padding: 0 1rem;
    }
  }

  ol > li {
    &::marker {
      font-weight: 700;
    }
  }

  ol ul {
    margin-top: 1rem;
  }

  li {
    font-size: 1.2rem;
    color: ${almostBlack};
    font-weight: 500;
    line-height: 145%;
    text-align: left;
  }

  li svg {
    vertical-align: middle;
    margin-top: -0.35rem;
  }

  span.strong {
    font-weight: 700;
  }
`;

const ResponsiveRow = styled.div`
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
    gap: 2rem;
    padding: 3rem 0;
    &:last-child {
      padding-bottom: 0;
    }
  }
`;

const ContentText = styled.div`
  flex: 1;
  box-sizing: border-box;
  ${_sharedFlexColumn}
  justify-content: center;
  padding: 0 4rem 0 4rem;
  gap: 2rem;

  @media (max-width: 1200px) {
    padding: 0 2rem 0 2rem;
  }

  @media (max-width: 992px) {
    padding: 0;
    text-align: center;
    max-width: 36rem;
    margin: auto;
  }
`;

const ContentImage = styled.img`
  object-fit: cover;
  max-height: 25rem;
  width: 100%;
  height: auto;
  border-radius: 1rem;
  align-self: center;
  aspect-ratio: 2 / 1;
  &.square {
    aspect-ratio: 1 / 1;
    max-height: none;
  }

  @media (max-width: 992px) {
    order: 1;
    max-width: 40rem;
    margin: auto;
  }
`;

const PaleAdaptableColumn = styled(AdaptableColumn)`
  background-color: ${zeeguuTransparentLightYellow};
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
  ContentText,
  ContentImage,
  ResponsiveRow,
  AdaptableColumn,
  PaleAdaptableColumn,
  DescriptionText,
  CenterText,
};
