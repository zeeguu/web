import styled from "styled-components";
import { blue100 } from "../components/colors";

const UnfinishedArticlesBox = styled.div`
  display: flex;
  width: 95%;
  flex-direction: column;
  align-items: start;
  margin: 0.5em 0;
  background-color: ${blue100};
  border-radius: 2em;
  padding: 0.5em 1em;
  @media (max-width: 576px) {
    margin: 0.8em 0;
    padding: 0.2em 0.5em;
    flex-direction: column;
  }
`;

const UnfishedArticleBoxTitle = styled.h3`
  margin: 0.5em;
  margin-bottom: -0.7em;
`;

export { UnfinishedArticlesBox, UnfishedArticleBoxTitle };
