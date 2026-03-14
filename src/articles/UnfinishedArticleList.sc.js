import styled from "styled-components";

const UnfinishedArticlesBox = styled.div`
  position: relative;
  display: flex;
  width: 95%;
  flex-direction: column;
  align-items: start;
  margin: 0.5em 0;
  background-color: var(--continue-card-bg);
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

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-muted);
  display: flex;
  z-index: 1;

  &:hover {
    color: var(--text-primary);
  }
`;

export { UnfinishedArticlesBox, UnfishedArticleBoxTitle, CloseButton };
