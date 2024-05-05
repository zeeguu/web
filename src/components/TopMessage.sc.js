import styled from "styled-components";
import { zeeguuVeryLightOrange } from "./colors";

let TopMessage = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: auto;
  background-color: ${zeeguuVeryLightOrange};
  border-radius: 0.1em;
  max-width: 80%;
  margin: 2em;
  padding: 0.5em 0.5em;
  font-size: large;

  @media (min-width: 768px) {
    width: 36em;
  }

  .top-message-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export { TopMessage };
