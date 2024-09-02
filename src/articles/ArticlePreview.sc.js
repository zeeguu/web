import styled from "styled-components";
import {
  almostBlack,
  zeeguuOrange,
  zeeguuDarkOrange,
  zeeguuViolet,
} from "../components/colors";

const ArticlePreview = styled.div`
  margin-bottom: 1em;
  border-left: solid ${zeeguuOrange};
  margin-top: 2em;
  padding-left: 0.8em;
  padding-bottom: 1em;

  &.open {
    border-left: 0px;
  }
`;
/*
  The div contains the article preview contents
  and defines the size of the images relative to the 
  user's screen size. Note this does not include the source/
  publishing time or topics.
*/

const ArticleContent = styled.div`
  width: 100%;
  display: flex;
  color: inherit;
  font-weight: inherit;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-around;
  align-items: center;

  img {
    margin: 0.5em;
    margin-left: 0;
    max-width: 10em;
    max-height: 10em;
    border-radius: 1em;
    align-self: center;
    object-fit: cover;

    @media (max-width: 990px) {
      max-width: 14em;
      max-height: 10em;
    }
  }
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
  padding-right: 0.3em;
  font-weight: 500;
  display: block;
  width: 100%;
  &.open a {
    color: ${zeeguuViolet};
  }
`;

let Summary = styled.div`
  font-size: 0.83em;
  color: ${almostBlack};
  line-height: 1.5em;
  margin-top: 0.36em;
  width: 40em;
  margin: auto;
  margin-left: 1em;
  @media (max-width: 990px) {
    width: 100%;
  }
`;

let BottomContainer = styled.div`
  display: flex;
  margin-top: 0.5em;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 900px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 1em;
  }
`;

let Topics = styled.span`
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
  ArticlePreview,
  InvisibleTitleButton,
  ArticleContent,
  BottomContainer,
  Summary,
  Topics,
};
