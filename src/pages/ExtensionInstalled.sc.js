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

let ExtensionContainer = styled(FormContainer)`
  width: 40em;
  max-width: 80%;
  padding: 1.3em;
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
  width: 100%;
  min-height: 100vh;
  margin-top: -1em;
  padding-top: 1em;
  padding-bottom: 1em;
  background: ${zeeguuVeryLightOrange};
`;

export {
  ExtensionInstalledWrapper,
  ExtensionContainer,
  LinkContainer,
  OrangeButton,
  PageBackground,
};
