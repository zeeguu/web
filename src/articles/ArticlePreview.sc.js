import styled, { css } from "styled-components";
import {
  darkGrey,
  veryLightGrey,
  zeeguuOrange,
  zeeguuSecondGray,
  zeeguuSecondOrange,
  zeeguuVarmYellow,
} from "../components/colors";

const ArticlePreview = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100%;
  margin: 2em auto 1em;
  border-left: solid ${zeeguuSecondOrange};
  padding-left: 0.8em;

  ${({ isTwoColumns }) => {
    return !!isTwoColumns
      ? css`
          @media (min-width: 817px) {
            max-width: 45.5%;
            margin: 2em 0 0;
          }
        `
      : css`
          @media (min-width: 817px) {
            max-width: 100%;
            margin: 2em 0 0;
          }
        `;
  }};
`;

const Title = styled.div`
  max-width: 24em;
  padding-right: 0.3em;
  font-weight: 500;
  font-size: 18px;
  line-height: 130%;
`;

const Difficulty = styled.div`
  padding: 0 0.55em;
  width: 2.8em;
  height: 3.8em;
  text-align: center;
  border-radius: 50%;
  background-color: ${veryLightGrey};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 1em;
  flex-shrink: 0;
  float: right;
`;

const WordCount = styled(Difficulty)`
  background-color: ${veryLightGrey};
`;

let Summary = styled.div`
  color: ${darkGrey};
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
`;

let SourceImage = styled.span`
  img {
    background-color: ${zeeguuVarmYellow};
    height: 25px;
  }

  margin-right: 0.5em;
`;

let PublishingTime = styled.span`
  margin-right: 2em;
  padding-bottom: 1em;
`;

let Topics = styled.span`
  display: inline-block;

  margin-top: 1em;

  span {
    height: 1.2em;
    margin-left: 0.2em;
    border: solid ${zeeguuOrange};
    border-radius: 1.0416666666666667em;
    padding: 0.20833333333333334em 1.3541666666666667em;
    font-size: 0.8333333333333334em;
  }
`;

const ArticleFooterBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleBox = styled.div`
  display: inline-block;

  & a {
    margin-right: 10px;
    line-height: 130%;
    color: ${zeeguuSecondGray};
  }
`;

const LabelsBox = styled.div`
  display: inline-block;
`;

const TopicsBox = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export {
  Title,
  Difficulty,
  WordCount,
  ArticlePreview,
  Summary,
  SourceImage,
  PublishingTime,
  Topics,
  ArticleFooterBox,
  TitleBox,
  LabelsBox,
  TopicsBox,
};
