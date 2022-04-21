import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

const InstallExtensionWrapper = styled.div`
  img {
    width: 100%;
  }
  h1 {
    margin-block-start: 0em;
    margin-block-end: 0em;
    text-align: center;
  }

  h4 {
    text-align: center;
  }

  p {
    font-size: 0.9em;
    margin-block-end: 0em;
  }
`;

const OrangeButton = styled.button`
  height: 4em;
  width: 30em;
  margin: 0em 1em 1em 1em;
  background: ${zeeguuOrange};
  border: 0.3em solid ${zeeguuOrange};
  border-radius: 7em;

  a {
    font-weight: 600;
    font-size: 1.5em !important;
    color: white;
  }
`;

let LinkContainer = styled.div`
  margin: 0.8em;
  display: flex;
  justify-content: space-evenly;
  flex-flow: wrap;
  a {
    font-size: small;
  }
`;

export { InstallExtensionWrapper, OrangeButton, LinkContainer };
