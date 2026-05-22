import styled from "styled-components";
import { zeeguuOrange, almostBlack } from "../components/colors";

const SearchField = styled.div`
  margin-bottom: 1em;
  padding: 0 1em;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
`;

const SearchInput = styled.input`
  all: unset;

  border: 0.15em solid ${zeeguuOrange};
  border-radius: 0.9375em;
  font-family: Montserrat;
  font-weight: 300;
  box-sizing: border-box;
  width: 100%;
  font-size: 1rem; /* Must be >= 16px to prevent iOS auto-zoom on focus */
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${almostBlack};
    font-weight: 600;
  }
`;

export { SearchField, SearchInput };
