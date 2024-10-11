import styled from "styled-components";
import { zeeguuOrange, almostBlack } from "../components/colors";

const SearchField = styled.div`
  margin-bottom: 1em;
  margin-left: 1em;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const SearchInput = styled.input`
  all: unset;

  border: 0.15em solid ${zeeguuOrange};
  border-radius: 0.9375em;
  padding: 0.125em;
  padding-left: 0.5em;
  padding-right: 5px;
  font-family: Montserrat;
  font-weight: 300;
  height: 1.5em;
  box-sizing: border-box;
  width: 50%;
  font-size: 0.9rem;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0;
  &:focus {
    border: 0.15em solid ${almostBlack};
    font-weight: 600 !important;
    width: 90%;
  }

  @media (max-width: 768px) {
    width: 70%;
    &:focus {
      width: 80%;
    }
  }
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
`;

export { SearchField, SearchInput };
