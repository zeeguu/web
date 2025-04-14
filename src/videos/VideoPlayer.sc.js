import styled from "styled-components";
import { white } from "../components/colors";

export const FullscreenButton = styled.button`
  position: absolute;
  left: 10px;
  bottom: 75px;
  transform: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  z-index: 10;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    right: 8px;
    bottom: 40px;
    padding: 6px 12px;
    font-size: 14px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 65vh;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  &:hover ${FullscreenButton} {
    opacity: 1;
  }

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 380px;
  }
`;

export const CaptionContainer = styled.div`
  margin-top: 1em;
  margin-bottom: 0.5em;
  padding: 1em;
  white-space: pre-wrap;
  font-size: 18px;
  text-align: center;
  color: #444;
  background: white;
  border-radius: 8px;
  min-height: 15vh;
  max-height: 15vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;

  @media (max-width: 768px) {
    font-size: 16px;
    min-height: 15vh;
    max-height: 15vh;
    margin-top: 0.25em;
    margin-bottom: 0.25em;
  }
`;

export const InfoContainer = styled.div`
  margin-top: 0.5em;
  margin-bottom: 2em;
  padding: 1em;
  background: white;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  gap: 2em;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
    gap: 1em;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: #444;
  font-size: 16px;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};

  &:hover {
    ${(props) => props.clickable && "opacity: 0.8;"}
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const MainContainer = styled.div`
  padding: 1rem;
  //  is this needed?
  min-height: 100vh;
  //  is this better than 100%?
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  background: ${white};
  overflow-y: auto;

  &.fullscreen {
    position: fixed;
    //  are these still needed if you have height 100vh?
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    padding: 0;
    z-index: 9999;

    ${VideoContainer} {
      max-width: 100vw;
      border-radius: 0;
      height: 80vh;
    }

    ${CaptionContainer} {
      margin: 0;
      border-radius: 0;
      background: #000;
      color: white;
      height: 20vh;
      min-height: 20vh;
      max-height: 20vh;
    }

    ${InfoContainer} {
      background: #000;
      color: white;
      margin: 0;
      border-radius: 0;
    }

    ${InfoItem} {
      color: white;
    }
  }
`;
