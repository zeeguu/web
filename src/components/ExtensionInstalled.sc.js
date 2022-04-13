import styled from "styled-components";
import { FormContainer } from "./FormPage.sc";

const ExtensionInstalledWrapper = styled.div`
  text-align: center;
  img {
    max-width: 100%;
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
  padding: 1.2em;
`;

export {
  ExtensionInstalledWrapper,
  ExtensionContainer,
  LinkContainer,
};
