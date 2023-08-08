import styled from "styled-components";
import {
  almostBlack,
  veryLightGrey,
  zeeguuOrange,
  zeeguuVarmYellow,
} from "../components/colors";

const ArticlePreview = styled.div`
  margin-bottom: 1em;
  border-left: solid ${zeeguuOrange};
  margin-top: 2em;
  padding-left: 0.8em;
`;

const Title = styled.div`
  font-size: 1.4em;
  color: black;
  max-width: 24em;
  padding-right: 0.3em;
  font-weight: 400;
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
    margin-left: 1em;
    height: 1.2em;
    margin-left: 0.2em;
    border: solid ${zeeguuOrange};
    border-radius: 1.0416666666666667em;
    padding: 0.20833333333333334em 1.3541666666666667em;
    font-size: 0.8333333333333334em;
  }
`;

let SaveButton = styled.button`
  font-size: small;
`;

let SavedLabel = styled.span`
  font-size: small;
  font-color: orange;
  
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
  SaveButton,
  SavedLabel
};
