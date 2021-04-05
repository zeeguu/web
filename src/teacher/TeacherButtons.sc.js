import styled, { css } from "styled-components";
import {
  zeeguuOrange,
  lightOrange,
  lightBlue,
  darkBlue,
  darkGrey
} from "../components/colors";

const StyledButton = styled.button`
  user-select: none;
  /* display: inline-block; */

  margin-right: 0.5em;
  border-radius: 1.0625em;
  padding: 0.3125em 1.1875em;
  font-family: Montserrat;
  font-weight: 500;
  text-align: center;

  cursor: pointer;
  margin-top: 3px;
 // box-sizing: border-box;
  
  //Primary
  ${(props) => props.primary && css`
  color:white;
  background-color:${darkBlue};
  border: 2px solid ${darkBlue};
`}
  //Secondary
  ${(props) => props.secondary && css`
  color:${darkBlue};
  background-color:white;
  border: 2px solid ${lightBlue};
  `}
  `

  const TopButton = styled.div`
      display:flex;
      justify-content:center;
      align-items: center;
      height:4em;`

  export { StyledButton, TopButton} ;