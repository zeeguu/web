import styled from "styled-components";
import { white, almostBlack, lightGrey, zeeguuDarkOrange } from "../components/colors";

export const CardContainer = styled.div`
  width: 500px;
  max-width: 95vw;
  height: min(600px, 100%);
  max-height: 100%;
  min-height: 0;
  background: ${white};
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  position: static;
  top: auto;
  left: auto;
  transform: none;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 0 0 clamp(140px, 50%, 320px);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ReadTimeWrapper = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  color: ${almostBlack};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
`;

export const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${almostBlack};
  margin: 0 0 1rem 0;
`;

export const Summary = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  color: ${almostBlack};
  flex-grow: 1;
  min-height: 0;
  overflow: auto;
`;

export const ContinueReading = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${zeeguuDarkOrange};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Footer = styled.div`
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  color: ${lightGrey};
  text-align: center;
`;

export const FeedName = styled.span`
  font-size: small;
  font-style: oblique;
  margin-right: 0.5em;
`;
