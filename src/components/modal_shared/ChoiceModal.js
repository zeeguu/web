import Modal from "./Modal";
import styled from "styled-components";
import { zeeguuOrange } from "../colors";

const Content = styled.div`
  text-align: center;
  /* Top padding clears the absolutely-positioned close button; side
     padding is small because ModalWrapper already adds its own. */
  padding: 1.5em 0.25em 0.5em 0.25em;
`;

const HeroImage = styled.img`
  width: 100%;
  height: ${(props) => (props.$slim ? "110px" : "160px")};
  object-fit: cover;
  border-radius: 0.5em;
  margin-bottom: 1.2em;
`;

const Title = styled.h3`
  /* Near-black (light) / near-white (dark) for AA contrast against the
     modal background. Orange is reserved for the brand accent. */
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 1.4em 0;
  font-size: 1.1rem;
  line-height: 1.35;
  font-weight: 500;
  overflow-wrap: break-word;
`;

const Message = styled.div`
  color: var(--text-primary, #222);
  text-align: center;
  margin: 0 0 2.2em 0;
  font-size: 1.05rem;
  line-height: 1.5;
`;

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  align-items: center;
`;

const SecondaryLink = styled.button`
  background: none;
  border: none;
  padding: 0.5em 0.75em;
  color: ${zeeguuOrange};
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  max-width: 320px;
  padding: 0.75em 1.2em;
  border-radius: 0.5em;
  border: ${(props) => (props.$primary ? "none" : `1.5px solid ${zeeguuOrange}`)};
  background-color: ${(props) => (props.$primary ? zeeguuOrange : "transparent")};
  /* Dark text on the orange fill — white-on-orange is low-contrast
     for accessibility, and it washes out visually in dark mode. */
  color: ${(props) => (props.$primary ? "#1a1a2e" : zeeguuOrange)};
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
  heroImage,
  slimHero = false,
  secondaryAsLink = false,
}) {
  const secondary = secondaryAsLink ? (
    <SecondaryLink onClick={onSecondary} disabled={isLoading}>
      {secondaryLabel}
    </SecondaryLink>
  ) : (
    <ActionButton $primary={!primaryFirst} onClick={onSecondary}>
      {secondaryLabel}
    </ActionButton>
  );

  return (
    <Modal open={true} onClose={onSecondary}>
      <Content>
        {heroImage && <HeroImage src={heroImage} alt="" $slim={slimHero} />}
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
          {secondary}
        </ButtonStack>
      </Content>
    </Modal>
  );
}
