import styled from "styled-components";

const WordsForArticleContainer = styled.div`
  display: flex;
  gap: 2em;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1em;
    padding: 0;
  }

  @media (max-width: 576px) {
    gap: 0.5em;
    padding: 0;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  margin-left: 15%;
  margin-right: 5%;
  width: 100%;
  padding: 1px;
  margin-top: 2em;

  @media (max-width: 768px) {
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 0;

    > div[class*="Infobox"] {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

export { WordsForArticleContainer, LeftContent };
