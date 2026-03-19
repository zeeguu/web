import styled from "styled-components";
import {
  blue100,
  orange100,
  orange400,
  orange500,
  veryLightGrey,
  zeeguuOrange,
} from "../components/colors";

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

export const BackNavigation = styled.div`
  margin-bottom: 0.8rem;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover {
    background: var(--hover-bg);
    border-color: var(--border-color);
  }
`;

export const ErrorText = styled.p`
  margin: 0.5rem 0;
  color: #c0392b;

  :root[data-theme="dark"] & {
    color: #ff8a80;
  }
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
    gap: 1rem;
  }

  .username,
  .display-name {
    margin-bottom: 1rem;
    font-size: 1.4rem;
    font-weight: 700;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .username {
    color: var(--text-primary);
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
    background: var(--light-badge-bg);
    border-radius: 8px;
    padding: 0.6rem 1rem;
  }

  .stat-streak-wrapper {
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: ${orange500};
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
  background: ${veryLightGrey};
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: ${orange100};
    color: ${orange500};
  }
`;

export const FriendActionsContainer = styled.div`
  position: absolute;
  top: 1rem;
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

export const FriendActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 6px;
  border: 1px solid
    ${({ $variant }) => {
      switch ($variant) {
        case "danger":
          return "#e74c3c";
        case "success":
          return "#2ecc71";
        case "warning":
          return "#e67e22";
        default:
          return "#3498db";
      }
    }};
  background: #fff;
  color:
    ${({ $variant }) => {
      switch ($variant) {
        case "danger":
          return "#e74c3c";
        case "success":
          return "#2ecc71";
        case "warning":
          return "#e67e22";
        default:
          return "#3498db";
      }
    }};
  padding: 0.4rem 0.75rem;
  cursor: pointer;
`;

export const FriendAvatarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

export const FriendDetails = styled.div`
  padding-right: 12rem;

  @media (max-width: 768px) {
    padding-right: 0;
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
    transition:
      color 0.2s,
      border-color 0.2s;

    &.active {
      color: ${zeeguuOrange};
      border-bottom-color: ${zeeguuOrange};
      font-weight: 600;
    }

    &:hover {
      color: ${orange500};
    }

    &.active:hover {
      border-bottom-color: ${orange500};
    }
  }
`;

export const TabContent = styled.div`
  min-height: 120px;
  padding: 1rem 0 0;
`;

export const OverflowBubble = styled.button`
  box-sizing: content-box;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border-radius: 50%;
  background: var(--light-badge-bg);
  border: 0.08rem solid var(--border-light);
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: var(--tag-bg);
  }
`;

export const LanguagesGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
`;

export const LanguageCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0 0.75rem 0 0.5rem;
  height: 2.75rem;
  border-radius: 2rem;
  border: solid 0.1rem var(--border-color);
  box-shadow: 0 0.1rem var(--border-color);
  white-space: nowrap;
  flex: 1 1 calc(50% - 2rem);
  min-width: 11rem;
  background: var(--card-bg);
  margin-bottom: 0.2rem;

  .language-name {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-primary);
    text-transform: capitalize;
    flex: 1;
  }

  .streaks-info {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-left: 0.75em;
    border-left: 1px solid var(--border-light);
    height: 1.5em;
    gap: 0.4rem;
    flex: 1;
    justify-content: end;
  }

  .streak-item {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: ${orange500};
    flex: 1;
  }

  .max-streak {
    color: var(--link-color);
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

  &.clickable {
    border: 3px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: ${orange400};
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