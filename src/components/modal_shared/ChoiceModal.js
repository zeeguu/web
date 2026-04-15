import Modal from "./Modal";
import styled from "styled-components";
import { zeeguuOrange } from "../colors";

const Content = styled.div`
  text-align: center;
  /* Horizontal padding keeps the title clear of the absolutely-positioned
     close button on narrow widths. */
  padding: 1em 1.5em 0.5em 1.5em;
`;

const Title = styled.h3`
  color: var(--text-primary, #222);
  margin: 0 0 1.5em 0;
  font-size: 1.3rem;
  line-height: 1.35;
  font-weight: 600;
  overflow-wrap: break-word;
`;

const Message = styled.p`
  color: var(--text-primary, #222);
  text-align: center !important;
  margin: 0 0 3em 0 !important;
  font-size: 1.05rem;
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
  title,
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
        {title && <Title>{title}</Title>}
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
