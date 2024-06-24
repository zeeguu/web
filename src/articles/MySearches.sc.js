import styled from "styled-components";
import {
  almostBlack,
  zeeguuOrange
} from "../components/colors";

const HeadlineSavedSearches = styled.div`
  color: ${almostBlack};
  margin: 0;
  font-size: 34px;
  font-weight: bold;
`;

const buttonMoreArticles = styled.button`
  box-shadow: none;
  all: unset;
  margin: 0;
  color: ${zeeguuOrange};
  font-size: 14px;
  font-weight: bold;
`;

const Line = styled.hr`
  color: ${almostBlack};
  height: 5;
  margin-bottom: 40px;
`;

export {
  HeadlineSavedSearches,
  buttonMoreArticles, 
  Line};
