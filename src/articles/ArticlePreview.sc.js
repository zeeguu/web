import styled from "styled-components";
import {zeeguuOrange} from "../components/colors"

const ArticlePreview = styled.div`
  margin-bottom: 1em;
  border-left: solid ${zeeguuOrange};
  margin-top: 2em;
  padding-left: 0.8em;
`;

const Header = styled.div`
  /* display: flex; */
`;

const Title = styled.div`
  font-size: 1.4em;
  color: black;
  max-width: 24em;
  padding-right: 0.3em;

  a {
    text-decoration: none;
  }
`;

const Difficulty = styled.div`
  padding: 0.3em;
  width: 1.8em;
  height: 1.8em;
  text-align: center;
  border-radius: 50%;
  background: #f1f0f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 1em;
  flex-shrink: 0;
  float: right;
`;

const WordCount = styled(Difficulty)`
  background: #f1f0f0;
`;

let Summary = styled.div`
  font-size: 0.83em;
  color: #6d6d6d;
  max-width: 44em;
  line-height: 1.5em;
  margin-top: 0.36em;
`;

let SourceImage = styled.span`
  img {
    background-color: yellow;
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
    border: solid #ffbb54;
    border-radius: 1.0416666666666667em;
    padding: 0.20833333333333334em 1.3541666666666667em;
    font-size: 0.8333333333333334em;
  }
`;

export {
  Header,
  Title,
  Difficulty,
  WordCount,
  ArticlePreview,
  Summary,
  SourceImage,
  PublishingTime,
  Topics,
};
