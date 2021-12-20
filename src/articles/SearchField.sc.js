import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

const SearchField = styled.div`
  margin-bottom: 1em;
  margin-left: 1em;

  display: inline-block;
  padding: 4px;

  #search-expandable {
    all: unset;
    border: 0.17em solid ${zeeguuOrange};
    border-radius: 0.9375em;
    padding: 0.125em;
    padding-left: 0.5em;
    padding-right: 5px;
    font-family: Montserrat;
    font-weight: 300;
    font-size: 0.875em;
    height: 1.5em;
  }
`;

export { SearchField };
