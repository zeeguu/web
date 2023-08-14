import styled from "styled-components";
import {
  almostBlack,
  veryLightGrey,
  zeeguuOrange,
  zeeguuVarmYellow,
  zeeguuDarkOrange,
} from "../components/colors";

const ArticlePreview = styled.div`
  margin-bottom: 1em;
  border-left: solid ${zeeguuOrange};
  margin-top: 2em;
  padding-left: 0.8em;
`;

//Invisible component that allows to open the redirection
//notification modal when the article's title is clicked
//used within the titleLink(article) function
const InvisibleTitleButton = styled.button`
  font: inherit;
  color: inherit;
  text-align: left;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: none;
  border: none;
`;
//previously the color was defined as black and font-weight was 400 but dark orange was
//displayed and font-weight 500 because the article's title inside the titleLink(article) function
//was wrapped in a link tag and inherited its color and font weight settings.
//Currently the article's title is no longer wrapped in a link, this is why styling update
const Title = styled.div`
  font-size: 1.4em;
  color: ${zeeguuDarkOrange};
  max-width: 24em;
  padding-right: 0.3em;
  font-weight: 500;
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
  font-size: 0.83em;
  color: ${almostBlack};
  max-width: 44em;
  line-height: 1.5em;
  margin-top: 0.36em;
`;

let SourceImage = styled.span`
  img {
    background-color: ${zeeguuVarmYellow};
    height: 1.5em;
  }
  margin-right: 2em;
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


export {
  Title,
  Difficulty,
  WordCount,
  ArticlePreview,
  InvisibleTitleButton,
  Summary,
  SourceImage,
  PublishingTime,
  Topics,
};
