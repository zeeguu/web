import styled from "styled-components";
import { zeeguuOrange, zeeguuLightYellow } from "../../components/colors";

export const TriggerButton = styled.button`
  background: none !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 0.5em;
  color: var(--text-muted);
  text-decoration: underline;
  font-size: small !important;
  font-weight: 500;
  cursor: pointer;
  font-family: "Montserrat";

  &:hover {
    filter: brightness(110%);
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
  z-index: 2000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 70vh;
  min-height: 300px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;

  h3 {
    margin: 0;
    color: var(--text-primary);
    flex: 1;
    margin-right: 1rem;
    word-wrap: break-word;
    line-height: 1.3;
    font-size: 1.1rem;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--text-primary);
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
    color: var(--text-secondary);
  }
`;

export const ExamplesContainer = styled.div`
  margin-top: 1rem;
`;

export const ExampleOption = styled.div`
  border: 2px solid ${(props) => (props.$selected ? zeeguuOrange : "var(--border-color)")};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$disabled ? "var(--bg-secondary)" : props.$selected ? zeeguuLightYellow + "20" : "var(--bg-primary)")};
  opacity: ${(props) => (props.$disabled ? 0.7 : 1)};

  text-align: left;

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      border-color: ${zeeguuOrange};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    `}
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SentenceText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

export const TranslationText = styled.div`
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 0.5rem;
`;

export const LevelBadge = styled.span`
  background-color: ${zeeguuOrange};
  color: var(--orange-btn-text);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  color: var(--text-secondary);
`;

export const SectionLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;

  &:first-child {
    margin-top: 0;
  }
`;

export const ContextTypeBadge = styled.span`
  background-color: var(--badge-bg);
  color: var(--badge-text);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
  white-space: nowrap;
  font-style: normal;
`;

export const ContextTitle = styled.div`
  font-size: 0.85rem;
  color: var(--text-faint);
  margin-top: 0.5rem;
  font-style: italic;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
`;

export const CancelButton = styled.button`
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--text-faint);
    color: var(--text-primary);
  }
`;

export const SaveButton = styled.button`
  background: ${zeeguuOrange};
  border: 2px solid ${zeeguuOrange};
  color: var(--orange-btn-text);
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
