import styled from "styled-components";
import { darkBlue, lightBlue, lightGrey } from "../../components/colors";

export const FilterInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0.5em 0 1em 0;

  input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.5em 2em 0.5em 0.75em;
    border: 2px solid ${lightGrey};
    border-radius: 1.0625em;
    font-family: Montserrat;
    font-size: 1em;
    color: ${darkBlue};

    &:focus {
      outline: none;
      border-color: ${lightBlue};
    }
  }

  .clear-filter {
    position: absolute;
    right: 0.6em;
    border: none;
    background: none;
    padding: 0;
    font-size: 1.2em;
    line-height: 1;
    color: ${darkBlue};
    cursor: pointer;
  }
`;
