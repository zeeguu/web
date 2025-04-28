import styled from "styled-components";
import { almostBlack, zeeguuDarkOrange, blue100, blue400, blue600 } from "../components/colors";

const VideoPreview = styled.div`
  margin-bottom: 1em;
  margin-top: 2em;
  padding-left: 0.8em;
  padding-bottom: 1em;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const Title = styled.div`
  font-size: 1.4em;
  color: ${zeeguuDarkOrange};
  padding-right: 0.3em;
  font-weight: 500;
  display: block;
  width: 100%;
`;

const ArticleContent = styled.div`
  width: 100%;
  display: flex;
  color: inherit;
  font-weight: inherit;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5em;

  img {
    margin: 0 0.5em;
    max-width: 10em;
    max-height: 10em;
    border-radius: 1em;
    align-self: center;
    object-fit: cover;

    @media (max-width: 990px) {
      align-content: center;
      justify-content: space-around;
      align-items: center;
      max-width: 14em;
      max-height: 10em;
      margin: 0.5rem;
    }
  }
  @media (max-width: 990px) {
    align-content: center;
    justify-content: space-around;
    align-items: center;
  }
`;

const Summary = styled.div`
  font-size: 0.83em;
  color: ${almostBlack};
  line-height: 1.5em;
  margin-top: 0.36em;
  width: 40em;
  @media (max-width: 990px) {
    width: 100%;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0.5em;
  justify-content: space-between;
  @media (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5 rem;
  }
`;

const UrlTopics = styled.div`
  display: inline-block;
  cursor: help;
  margin-top: 1em;
  .inferred {
    border: dashed 1px ${blue400};
  }
  .gold {
    border: solid 1px ${blue600};
  }

  span {
    height: 1.2em;
    margin-left: 0.2em;
    margin-bottom: 0.5em;
    border-radius: 2em;
    padding: 0.4em 1.35em;
    font-size: 0.85em;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
    background-color: ${blue100};
  }
  .cancelButton {
    cursor: pointer;
    padding-left: 0.3em;
    margin-bottom: -0.3em;
    margin-right: -0.3em;
  }
  @media (max-width: 990px) {
    margin-bottom: 1.2em;
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  cursor: pointer;
`;

const PlayButtonOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 0.75rem;
  color: white;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export {
  VideoPreview,
  TitleContainer,
  Title,
  ArticleContent,
  Summary,
  BottomContainer,
  UrlTopics,
  VideoThumbnail,
  PlayButtonOverlay,
};
