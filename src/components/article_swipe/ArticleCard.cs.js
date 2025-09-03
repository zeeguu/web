// ArticleCardPlaceholder.cs.js
import styled from 'styled-components';
import {
    zeeguuDarkOrange,
    zeeguuVeryLightOrange,
    white,
    zeeguuTransparentLightOrange,
    veryLightGrey,
    almostBlack, lightGrey
} from "../colors";

export const CardContainer = styled.div`
  width: 500px;
  max-width: 95vw;
  height: 600px;
  background-color: ${white};
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px ${veryLightGrey};       
  overflow: hidden;
  cursor: grab;
  margin: 0 auto;
`;

export const Header = styled.div`
  height: 160px;
  background: linear-gradient(to bottom right, rgba(255, 140, 0, 0.1), rgba(255, 184, 77, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Icon = styled.div`
  width: 64px;
  height: 64px;
  color: #ff8c00;
`;

export const Content = styled.div`
  padding: 2rem;
  height: 440px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${almostBlack};
`;

export const Summary = styled.div`
  flex-grow: 1;
  margin-bottom: 1.25rem;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.05));
  border-radius: 0.75rem;
  padding: 0.5rem;
`;

export const SummaryText = styled.p`
  font-size: 1.125rem;
  line-height: 1.75;
  color: ${almostBlack};
`;

export const Footer = styled.div`
  font-size: 0.875rem;
  color: ${lightGrey};
  text-align: center;
`;
