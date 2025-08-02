import styled from "styled-components";
import { zeeguuOrange, lightGrey, zeeguuLightYellow } from "../../components/colors";

export const TriggerButton = styled.button`
  background: none;
  border: none;
  color: ${zeeguuOrange};
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0;
  margin: 0 0.5em;

  &:hover {
    color: ${zeeguuLightYellow};
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${lightGrey};
  flex-shrink: 0;

  h3 {
    margin: 0;
    color: #333;
    flex: 1;
    margin-right: 1rem;
    word-wrap: break-word;
    line-height: 1.3;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;

  p {
    margin-bottom: 1rem;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  p {
    margin-top: 1rem;
    color: #666;
  }
`;

export const ExamplesContainer = styled.div`
  margin-top: 1rem;
`;

export const ExampleOption = styled.div`
  border: 2px solid ${(props) => (props.selected ? zeeguuOrange : lightGrey)};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.selected ? zeeguuLightYellow + "20" : "white")};

  text-align: left;

  &:hover {
    border-color: ${zeeguuOrange};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SentenceText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const TranslationText = styled.div`
  font-size: 0.95rem;
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
`;

export const LevelBadge = styled.span`
  background-color: ${zeeguuOrange};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  color: #666;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${lightGrey};
  flex-shrink: 0;
`;

export const CancelButton = styled.button`
  background: white;
  border: 2px solid ${lightGrey};
  color: #666;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #999;
    color: #333;
  }
`;

export const SaveButton = styled.button`
  background: ${zeeguuOrange};
  border: 2px solid ${zeeguuOrange};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${zeeguuLightYellow};
    border-color: ${zeeguuLightYellow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
