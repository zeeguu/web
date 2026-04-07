import ModalMui from "@mui/material/Modal";
import { ModalWrapper } from "./modal_shared/Modal.sc";
import styled from "styled-components";
import { zeeguuOrange } from "./colors";

const Content = styled.div`
  text-align: center;
  padding: 0.5em 0;
`;

const Subtitle = styled.p`
  color: var(--text-muted, #666);
  margin-bottom: 1.5em;
  font-size: 0.95rem;
`;

const RetryButton = styled.button`
  width: 100%;
  max-width: 320px;
  padding: 0.75em 1.2em;
  border-radius: 0.5em;
  border: none;
  background-color: ${zeeguuOrange};
  color: white;
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

/**
 * Shown when the server fails to return user details on startup.
 * Non-dismissable — the user must retry or wait until it works.
 */
export default function ServerErrorModal({ onRetry }) {
  return (
    <ModalMui open={true}>
      <ModalWrapper>
        <Content>
          <h3>Connection problem</h3>
          <Subtitle>
            We couldn't reach the server. Check your connection and try again.
          </Subtitle>
          <RetryButton onClick={onRetry}>Try again</RetryButton>
        </Content>
      </ModalWrapper>
    </ModalMui>
  );
}
