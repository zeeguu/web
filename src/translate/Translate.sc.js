import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

export const SearchContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: flex-end;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TranslateButton = styled.button`
  background-color: ${zeeguuOrange};
  color: white;
  border: none;
  border-radius: 0.3rem;
  padding: 0 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 2.5rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

export const ResultsContainer = styled.div`
  margin-top: 1rem;
`;

export const ResultsHeader = styled.h3`
  margin-bottom: 1rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const DirectionLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  color: #666;
  background: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
`;

export const DirectionToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: ${props => props.$canSwitch ? zeeguuOrange : '#666'};
  background: #f5f5f5;
  padding: 0.3rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e0e0e0;
  cursor: ${props => props.$canSwitch ? 'pointer' : 'default'};
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.$canSwitch ? '#ebebeb' : '#f5f5f5'};
  }
`;

export const Flag = styled.img`
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
`;

export const SpeakButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: ${zeeguuOrange};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 140, 66, 0.1);
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

export const TranslationCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;

  &:hover {
    border-color: ${zeeguuOrange};
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

export const TranslationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TranslationText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

export const TranslationSource = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

export const AddButton = styled.button`
  background-color: ${zeeguuOrange};
  color: white;
  border: none;
  border-radius: 0.3rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
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

export const CardExplanation = styled.div`
  font-size: 0.95rem;
  color: #444;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  background: #f0f7ff;
  border-left: 3px solid #4a90d9;
  border-radius: 0 0.25rem 0.25rem 0;
`;

export const LevelNote = styled.div`
  font-size: 0.85rem;
  color: #666;
  padding: 0.25rem 0;
  margin-bottom: 0.5rem;
  font-style: italic;
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
