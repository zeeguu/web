import styled, { css } from "styled-components";
import { zeeguuOrange } from "../../components/colors";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    font-size: 0.9em;
    margin-block-end: 0em;
  }
`;

const BaseSectionStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  gap: 1.5rem;
`;

const Header = styled.header`
  ${BaseSectionStyle}
`;

const Logo = styled.img`
  width: 2.25rem;
`;

const Heading = styled.h1`
  width: 80%;
  font-size: 1.3em;
  line-height: 150%;
  text-align: center;
  font-weight: 700;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 1.2em;
    width: 90%;
  }

  @media (max-width: 576px) {
    text-align: left;
    width: 100%;
  }
`;

const Main = styled.main`
  ${BaseSectionStyle}
`;

const ImageMain = styled.img`
  width: 80%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const Footer = styled.footer`
  ${BaseSectionStyle}
`;

let LinkContainer = styled.div`
  /* margin: 0.8em; */
  display: flex;
  justify-content: space-evenly;
`;

let PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 40em;
  max-width: 80%;
  border-radius: 1em;

  width: 750px;
  padding: 2rem;
  margin: 1rem;

  background-color: white;

  @media (max-width: 1200px) {
    /* max-width: 800px; */
    margin: 0.5rem;
    max-width: 750px;
    width: 80%;
  }

  @media (max-width: 576px) {
    padding: 24px 24px;
    margin: 0.5rem;
    max-width: 500px;
    width: 90%;
  }
`;

const OrangeButton = styled.button`
  min-height: 4em;
  width: 20em;
  /* margin: 0em 1em 0em 1em; */
  background: ${zeeguuOrange};
  border: 0.3em solid ${zeeguuOrange};
  border-radius: 7em;

  a {
    font-weight: 600;
    font-size: 1.5em;
    color: white;
  }
`;

let PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  min-height: 100vh;
  /* margin-top: -1em; */

  /* padding-top: 0.5rem;
  padding-bottom: 0.5rem; */
  background: ${zeeguuOrange};
`;

let VideoLink = styled.p`
  margin: 0em;
  padding-bottom: 1em;
`;

export {
  ContentWrapper,
  Header,
  Logo,
  Heading,
  Main,
  ImageMain,
  Footer,
  PageContainer,
  LinkContainer,
  OrangeButton,
  PageBackground,
  VideoLink,
};
