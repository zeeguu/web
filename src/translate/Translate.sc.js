import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const SearchContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
`;

export const SearchInput = muiStyled(TextField)`
  flex: 1;
`;

export const TranslateButton = styled.button`
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 56px;

  &:hover {
    background-color: #005f8a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ResultsContainer = styled.div`
  margin-top: 1rem;
`;

export const ResultsHeader = styled.h3`
  margin-bottom: 1rem;
  font-weight: 500;
  color: #333;
`;

export const TranslationCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;

  &:hover {
    border-color: #0077b6;
  }
`;

export const TranslationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const TranslationInfo = styled.div`
  flex: 1;
`;

export const TranslationText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

export const TranslationSource = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

export const AddButton = styled.button`
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #005f8a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const AddedBadge = styled.span`
  color: #28a745;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
`;

export const ExamplesSection = styled.div`
  margin-top: 0.5rem;
`;

export const ExamplesLoading = styled.div`
  color: #888;
  font-size: 0.9rem;
  font-style: italic;
  padding: 0.5rem 0;
`;

export const ExampleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 0.25rem;
  background: #f9f9f9;
`;

export const ExampleText = styled.span`
  font-size: 0.95rem;
  color: #444;
  line-height: 1.4;
`;

export const NoExamples = styled.div`
  color: #888;
  font-size: 0.9rem;
  font-style: italic;
  padding: 0.5rem 0;
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

export const NoResults = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
  font-style: italic;
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;
