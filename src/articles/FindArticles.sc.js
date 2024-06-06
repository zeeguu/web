import styled from "styled-components";
import {
  almostBlack, 
  zeeguuOrange, 
  white
} from "../components/colors";

const MaterialSelection = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const HeadlineSearch = styled.div`
  h1{
    color: ${almostBlack};
    margin: 0;
    font-size: 34px;
    font-weight: bold;
  }
  p{
    margin: 0;
    color: ${zeeguuOrange};
    font-size: 14px;
    font-weight: bold;
  }
`;

const RowHeadlineSearch = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

let KeywordsLight = styled.span`
  display: flex;
  margin-top: 1em;

  span {
    height: 1.2em;
    margin-left: 0.5em;
    border: solid ${zeeguuOrange};
    border-radius: 1.0416666666666667em;
    padding: 0.20833333333333334em 1.3541666666666667em;
    font-size: 0.8333333333333334em;
  }
`;

let KeywordsDark = styled.span`
  display: flex;
  margin-top: 1em;

  span { 
    height: 1.2em;
    margin-left: 0.5em;
    color: solid ${zeeguuOrange};
    border-radius: 1.0416666666666667em;
    padding: 0.20833333333333334em 1.3541666666666667em;
    font-size: 0.8333333333333334em;
  }
`;

export { 
  MaterialSelection,
  HeadlineSearch,
  RowHeadlineSearch,
  KeywordsLight };
