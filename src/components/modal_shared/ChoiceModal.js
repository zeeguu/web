import Modal from "./Modal";
import styled from "styled-components";
import { zeeguuOrange } from "../colors";

const Content = styled.div`
  text-align: center;
  padding: 0.5em 0;
`;

const Message = styled.p`
  color: var(--text-primary, #222);
  margin: 0.5em 0 2.5em 0;
  font-size: 1.15rem;
  line-height: 1.5;
`;

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  align-items: center;
`;

const ActionButton = styled.button`
  width: 100%;
  max-width: 320px;
  padding: 0.75em 1.2em;
  border-radius: 0.5em;
  border: ${(props) => (props.$primary ? "none" : `1.5px solid ${zeeguuOrange}`)};
  background-color: ${(props) => (props.$primary ? zeeguuOrange : "transparent")};
  color: ${(props) => (props.$primary ? "white" : zeeguuOrange)};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * A reusable modal with a single message and two action buttons.
 * The `primaryFirst` prop controls which button gets the filled style.
 */
export default function ChoiceModal({
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  isLoading,
  loadingLabel,
  primaryFirst = true,
}) {
  return (
    <Modal open={true} onClose={onSecondary}>
      <Content>
        <Message>{message}</Message>
        <ButtonStack>
          <ActionButton
            $primary={primaryFirst}
            onClick={onPrimary}
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            {isLoading ? loadingLabel : primaryLabel}
          </ActionButton>
          <ActionButton $primary={!primaryFirst} onClick={onSecondary}>
            {secondaryLabel}
          </ActionButton>
        </ButtonStack>
      </Content>
    </Modal>
  );
}
