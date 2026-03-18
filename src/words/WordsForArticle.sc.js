import styled from "styled-components";

const WordsForArticleContainer = styled.div`
  display: flex;
  gap: 2em;
  width: 100%;
  flex-wrap: wrap;
  padding: 0 2em;

  @media (max-width: 768px) {
    gap: 1em;
    padding: 0 1em;
  }

  @media (max-width: 576px) {
    gap: 0.5em;
    padding: 0 0.5em;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  max-width: auto;
  margin-left: 20%;
  margin-right: 5%;
  width: 100%;
  padding: 1px;
  margin-top: 2em;

  @media (max-width: 768px) {
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 0;
  }

  @media (max-width: 576px) {
    margin-left: 5%;
    margin-right: 5%;
  }
`;

export { WordsForArticleContainer, LeftContent };
