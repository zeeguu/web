import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

const SavedSearchBlock = styled.div`
  padding: 0 1em;
  margin-bottom: 1.5em;
`;

const HeadlineSavedSearches = styled.div`
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const buttonMoreArticles = styled.button`
  box-shadow: none;
  all: unset;
  margin: 0;
  color: ${zeeguuOrange};
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 40px;
  cursor: pointer;
`;

export { SavedSearchBlock, HeadlineSavedSearches, buttonMoreArticles };
