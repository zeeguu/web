import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

export const DirectionSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const LanguageLabel = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  text-align: center;
  white-space: nowrap;
`;

export const SwapButton = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${zeeguuOrange};
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 140, 66, 0.1);
    border-color: ${zeeguuOrange};
  }
`;

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

export const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  width: 100%;
`;

// One line to start with, growing with the text (Translate.js sets the
// height); the look of InputField's one-line field.
// The field and its clear (×), which sits in the field's top-right corner
export const FieldWithClear = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
`;

export const TranslateInput = styled.textarea`
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  min-height: 2.5rem;
  max-height: 40vh;
  padding: 0.45rem 2.25rem 0.45rem 1rem; /* room on the right for the × */
  margin: 0;
  font: inherit;
  font-size: 1rem; /* Must be >= 16px to prevent iOS auto-zoom on focus */
  line-height: 1.4;
  border: 1.5px solid var(--input-border);
  border-radius: 0.3rem;
  background-color: var(--input-bg);
  color: var(--text-primary);
  resize: none;

  &:focus {
    outline: transparent;
    border-color: ${zeeguuOrange};
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: var(--text-primary);
    }
  }
`;

// Quiet, beside the field: the way in for a word or a message copied from
// another app (WhatsApp has no share button for text on Android).
export const PasteButton = styled.button`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: 1.5px solid var(--input-border);
  border-radius: 0.3rem;
  color: var(--text-muted);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: ${zeeguuOrange};
      border-color: ${zeeguuOrange};
    }
  }
`;

export const TranslateButton = styled.button`
  background-color: ${zeeguuOrange};
  color: var(--orange-btn-text);
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
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
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
  background: var(--card-bg);
  border: 1px solid var(--border-light);
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
  color: var(--text-primary);
`;

export const TranslationSource = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

export const AddButton = styled.button`
  background-color: ${zeeguuOrange};
  color: var(--orange-btn-text);
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

export const CardInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const CardExplanation = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
`;

export const ExamplesLoading = styled.div`
  color: var(--text-muted);
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
  background: var(--bg-secondary);
`;

export const ExampleText = styled.span`
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.4;
`;

export const NoExamples = styled.div`
  color: var(--text-muted);
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
  color: var(--text-secondary);
  padding: 2rem;
  font-style: italic;
`;

export const ReportButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-faint);
  display: flex;
  align-items: center;
  margin-top: 0.5rem;

  &:hover {
    color: var(--text-secondary);
  }
`;

export const ReportedBadge = styled.span`
  color: var(--text-faint);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;
