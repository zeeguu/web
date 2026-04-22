import styled from "styled-components";
import { orange500, streakFireOrange } from "../components/colors";
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

export const HeaderCard = styled.div`
  position: relative;
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px var(--shadow-color);
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .name-wrapper {
    display: flex;
    column-gap: 1rem;
    flex-wrap: wrap;
    margin: 1rem 0;
    padding-right: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0;
    }
  }

  .username,
  .display-name {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;

    @media (max-width: 768px) {
      justify-content: center;
      font-size: 1.25rem;
    }
  }

  .username {
    color: var(--text-primary);

    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  }

  .display-name {
    color: var(--text-secondary);
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 0.4rem;

    @media (max-width: 768px) {
      justify-content: center;
    }

    .flag-image-wrapper {
      cursor: pointer;
    }
  }

  .label {
    font-weight: 600;
    color: var(--text-secondary);
  }
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--streak-banner-border);
    border-radius: 8px;
    padding: 0.6rem 1rem;
  }

  .stat-streak-wrapper {
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }

  .stat-value {
    color: ${streakFireOrange};
    margin-right: 0.3rem;
  }

  .stat-label {
    color: var(--text-secondary);
  }

  .stat-value,
  .stat-label {
    font-size: 1rem;
    font-weight: 600;
  }
`;

export const EditProfileButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background: var(--streak-banner-border);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--streak-banner-hover);
    color: ${orange500};
  }
`;

export const FriendActionsContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    align-items: center;
    margin-bottom: 0.75rem;
  }
`;

export const TabsSection = styled.div`
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--shadow-color);
  padding: 1rem;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 1rem;

  button {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-weight: 500;
    margin-bottom: -2px;
    transition: color 0.3s,
    border-color 0.5s;

    &.active {
      color: ${streakFireOrange};
      border-bottom-color: ${streakFireOrange};
      font-weight: 600;
    }

    &:hover {
      color: ${orange500};
    }

    &.active:hover {
      border-bottom-color: ${orange500};
    }

    @media (max-width: 768px) {
      padding-left: 0.8rem;
      padding-right: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

export const TabContent = styled.div`
  min-height: 120px;
  padding: 1rem 0 0;
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

export const UnfriendModalButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const LanguagesGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.5rem;
  padding: 0;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    max-height: none;
    overflow-y: visible;
  }
`;

export const LanguageCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.1rem 0.75rem 0.1rem 0.5rem;
  min-height: 2.75rem;
  min-width: 11rem;
  border-radius: 2rem;
  border: solid 0.1rem var(--border-color);
  box-shadow: 0 0.1rem var(--border-color);
  white-space: nowrap;
  background: var(--card-bg);
  margin-bottom: 0.2rem;

  .language-name {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-primary);
    text-transform: capitalize;
    flex: 1;
    white-space: wrap;
  }

  .streaks-info {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-left: 0.75em;
    border-left: 1px solid var(--border-light);
    height: 1.5em;
    gap: 0.4rem;
    justify-content: end;
  }

  .streak-item {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    font-weight: 600;
    font-size: 0.9rem;
    justify-content: center;
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
