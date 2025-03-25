import styled, { css } from "styled-components";
import {
  zeeguuOrange,
  zeeguuTransparentLightYellow,
  veryDarkGrey,
  orange600,
} from "../components/colors";

const PageWrapper = styled.div`
  width: 100%;
`;

const _navbarShared = css`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  height: 4em;
`;

const NavbarBg = styled.div`
  ${_navbarShared};
  justify-content: center;
  background: white;
`;

const Navbar = styled.nav`
  ${_navbarShared};
  max-width: 90rem;
  justify-content: space-between;
  color: white;
  font-size: 18px;
  padding: 0 1rem;
`;

const LogoWithText = styled.div`
  color: ${orange600};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.25em;
  font-weight: 600;
  margin: 0;
  padding: 0;

  @media (max-width: 576px) {
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const ZeeguuLogo = styled.img`
  text-align: center;
  width: 1.9rem;

  @media (max-width: 576px) {
    width: 1.5rem;
  }
`;

const NavbarButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const PageContent = styled.div`
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

const HeroColumn = styled.div`
  height: auto;
  max-width: 52rem;
  padding: 6rem 1rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 576px) {
    padding: 3rem 1rem;
  }

  h1 {
    ${_mainHeader}
    color: ${veryDarkGrey};
    font-size: 3.5rem;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p.hero-paragraph {
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 150%;
    color: ${veryDarkGrey};
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

const NavbarButtonSharedStyles = css`
  all: unset;
  cursor: pointer;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  overflow-y: hidden;
  background-color: white;
`;

const WhiteFilledNavbarBtn = styled.button`
  ${NavbarButtonSharedStyles}
  border: solid 2px ${orange600};
  border-radius: 4em;
  color: ${orange600};
  box-shadow: 0px 0.1em ${orange600};
  transition: all ease-in 0.08s;

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all ease-in 0.08s;
  }
`;

const WhiteOutlinedNavbarBtn = styled.button`
  ${NavbarButtonSharedStyles}
  background: none;
  color: ${orange600};
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
  NavbarBg,
  Navbar,
  WhiteFilledNavbarBtn,
  WhiteOutlinedNavbarBtn,
  NavbarButtonContainer,
  LogoWithText,
  PageContent,
  HeroColumn,
  ZeeguuLogo,
  AdaptableColumn,
  PaleAdaptableColumn,
  DescriptionText,
  CenterText,
};
