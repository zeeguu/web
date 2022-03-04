import styled from "styled-components";
import { zeeguuTransparentMediumOrange } from "./colors";

let TopMessage = styled.div`
  text-align: center;
  margin: auto;
  background-color: ${zeeguuTransparentMediumOrange};
  border-radius: 0.9em;
  max-width: 80%;
  margin-bottom: 1.5em;
  padding: 0.4em 0.6em;

  @media (min-width: 768px) {
    width: 36em;
  }
`;

export { TopMessage };
