import styled from "styled-components";
import { FormContainer } from "../components/FormPage.sc";
import {
  zeeguuOrange,
  zeeguuVeryLightYellow,
  zeeguuVeryLightOrange,
  zeeguuTransparentLightOrange,
} from "../components/colors";

const ExtensionInstalledWrapper = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
  h1 {
    margin-block-start: 0em;
    margin-block-end: 0em;
    font-size: 1.3em;
    /* font-weight: 400; */
  }
  h4 {
    font-size: 1.5em;
    margin-block-start: 0.3em;
    margin-block-end: 0.3em;
  }
  p {
    font-size: 0.9em;
    margin-block-end: 0em;
  }
`;

let LinkContainer = styled.div`
  margin: 0.8em;
  display: flex;
  justify-content: space-evenly;
`;

let ExtensionContainer = styled.div`
  box-sizing: border-box;
  width: 40em;
  max-width: 80%;
  border-radius: 1em;

  width: 750px;
  padding: 3rem;

  /* Desktop width  */
  /* @media (min-width: 768px) {
    width: 22em;
  } */

  background-color: white;
`;

const OrangeButton = styled.button`
  min-height: 4em;
  width: 20em;
  margin: 0em 1em 0em 1em;
  background: ${zeeguuOrange};
  border: 0.3em solid ${zeeguuOrange};
  border-radius: 7em;

  a {
    font-weight: 600;
    font-size: 1.5em;
    color: white;
  }
`;

let PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  min-height: 100vh;
  margin-top: -1em;
  padding-top: 1em;
  padding-bottom: 1em;
  background: ${zeeguuOrange};
`;

let VideoLink = styled.p`
  margin: 0em;
  padding-bottom: 1em;
`;

export {
  ExtensionInstalledWrapper,
  ExtensionContainer,
  LinkContainer,
  OrangeButton,
  PageBackground,
  VideoLink,
};
