import styled from "styled-components";
import { zeeguuVeryLightOrange } from "./colors";

const Infobox = styled.div`
  display: flex;
  width: 80%;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
  margin: 1em 0;
  background-color: ${zeeguuVeryLightOrange};
  border-radius: 2em;
  padding: 1em 2em;

  p {
    margin-top: 0.5em;
  }
  img {
    width: 60px;
    margin: 0.5em;
  }

  @media (max-width: 576px) {
    margin: 0.8em 0;
    flex-direction: column;
  }
`;

export { Infobox };
