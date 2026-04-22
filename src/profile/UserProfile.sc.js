import styled from "styled-components";
import { orange500 } from "../components/colors";
import { ErrorText } from "../components/usefulSnippets.sc";

export { ErrorText };

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

export const BackNavigation = styled.div`
  margin-bottom: 0.8rem;
`;

export const LanguageOverflowBubble = styled.button`
  box-sizing: content-box;
  width: ${({ $size }) => $size ?? "1.75rem"};
  height: ${({ $size }) => $size ?? "1.75rem"};
  padding: 0;
  border-radius: 50%;
  background: var(--streak-banner-border);
  border: 0.08rem solid var(--border-light);
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--streak-banner-hover);
    color: ${orange500};
  }
`;

export const AvatarBackground = styled.div`
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  background: ${({ $backgroundColor }) => $backgroundColor};
  position: relative;

  &.clickable {
    border: 3px solid transparent;
    cursor: pointer;

    &:hover button {
      background: var(--streak-banner-hover);
      color: ${orange500};
    }
  }
`;

export const AvatarImage = styled.div`
  width: 70%;
  height: 70%;
  background-color: ${({ $color }) => $color};
  mask-image: url(${({ $imageSource }) => $imageSource});
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url(${({ $imageSource }) => $imageSource});
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
`;
