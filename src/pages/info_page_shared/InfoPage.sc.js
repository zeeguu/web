import styled, { css } from "styled-components";
import { zeeguuOrange, zeeguuDarkOrange } from "../../components/colors";
import { OrangeRoundButton } from "../../components/allButtons.sc";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: ${zeeguuOrange};
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  max-width: 80%;
  border-radius: 1em;

  width: 47rem;
  padding: 2rem;
  margin: 1rem;

  background-color: white;

  @media (max-width: 1200px) {
    margin: 0.5rem;
    max-width: 47rem;
    width: 80%;
  }

  @media (max-width: 576px) {
    padding: 24px 24px;
    margin: 0.5rem;
    max-width: 500px;
    width: 90%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

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
    width: 100%;
    text-align: left;
  }

  @media (max-width: 576px) {
    font-size: 1.2em;
  }
`;

const Main = styled.main`
  ${BaseSectionStyle}
`;

const ImageMain = styled.img`
  width: 80%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Footer = styled.footer`
  ${BaseSectionStyle}
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const Button = styled(OrangeRoundButton)`
  margin: 0;
  width: 16.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.2rem;
  padding: 1em 2em;
  border-radius: 4em;
  font-weight: 600;
  border-bottom: solid 0.2em ${zeeguuDarkOrange};

  @media (max-width: 768px) {
    width: auto;
    padding: 0.75em 2rem;
  }
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
  Button,
  ButtonContainer,
  PageBackground,
};
