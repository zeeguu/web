import { useState } from "react";
import styled from "styled-components";
import { StyledPrimaryButton } from "../InjectedReaderApp/Buttons.styles";

const PromptContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const PromptTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
`;

const PromptMessage = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

const PrimaryButton = styled(StyledPrimaryButton)`
  width: 200px;
  max-width: 90%;
  position: relative;

  &.translating {
    animation: pulse 2s ease-in-out infinite;

    .button-text {
      opacity: 0.9;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 0 20px 5px rgba(255, 152, 0, 0.3);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
    }
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ButtonText = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SecondaryButton = styled(StyledPrimaryButton)`
  background-color: #f0f0f0;
  color: #333;
  width: 200px;
  max-width: 90%;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default function TranslationPrompt({ detectedLanguage, learnedLanguage, onTranslate, onCancel, isTranslating }) {
  return (
    <PromptContainer>
      <PromptTitle>Different Language Detected</PromptTitle>
      <PromptMessage>
        This page appears to be in <strong>{detectedLanguage}</strong>. Would you like to translate it to{" "}
        <strong>{learnedLanguage}</strong>
        &nbsp;and adapt it to your reading level?
      </PromptMessage>
      <ButtonContainer>
        <PrimaryButton onClick={onTranslate} disabled={isTranslating} className={isTranslating ? "translating" : ""}>
          <ButtonText className="button-text">
            {isTranslating && <Spinner />}
            {isTranslating ? "Translating..." : "Translate & Adapt"}
          </ButtonText>
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>Nope, Cancel</SecondaryButton>
      </ButtonContainer>
    </PromptContainer>
  );
}
