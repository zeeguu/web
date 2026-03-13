import styled from "styled-components";
import {
  almostBlack,
  blue100,
  blue200,
  darkGrey,
  lightGrey,
  orange100,
  orange400,
  orange500,
  orange600,
  zeeguuOrange,
} from "../components/colors";

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

export const HeaderCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .username {
    margin-bottom: 1rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: ${almostBlack};

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${darkGrey};
    font-size: 0.9rem;
    margin-top: 0.4rem;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .label {
    font-weight: 600;
    color: #555;
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
    background: ${blue100};
    border-radius: 8px;
    padding: 0.6rem 1rem;
  }

  .stat-streak-wrapper {
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }

  .stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${orange500};
  }
`;

export const TabsSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #eee;
  margin-bottom: 1rem;

  button {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    color: ${darkGrey};
    cursor: pointer;
    font-weight: 500;
    margin-bottom: -2px;
    transition: color 0.2s, border-color 0.2s;

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
  background: ${blue100};
  border: 0.08rem solid ${blue200};
  color: ${almostBlack};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: ${blue200};
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
  border: solid 0.1rem ${lightGrey};
  box-shadow: 0 0.1rem ${lightGrey};
  white-space: nowrap;
  flex: 1 1 calc(50% - 2rem);
  min-width: 11rem;
  background: white;
  margin-bottom: 0.2rem;

  .language-name {
    font-weight: 600;
    font-size: 1rem;
    color: ${almostBlack};
    text-transform: capitalize;
    flex: 1;
  }

  .streaks-info {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-left: 0.75em;
    border-left: 1px solid rgba(128, 128, 128, 0.3);
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
    color: #e65100;
  }
`;

export const AvatarWrapper = styled.button`
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: ${orange100};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none ${orange400};
  cursor: pointer;
  padding: 0;
  transition: border-color 0.2s, transform 0.2s;
  background: ${({ $backgroundColor }) => ($backgroundColor)};

  &:hover {
    border: 3px solid ${orange400};
    transform: scale(1.05);
  }
`;

export const AvatarImage = styled.div`
  width: 70%;
  height: 70%;
  background-color: ${({ $color }) => ($color)};
  mask-image: url(${({ $imageSource }) => ($imageSource)});
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url(${({ $imageSource }) => ($imageSource)});
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
`;

export const PickerSection = styled.div`
  margin-bottom: 1.5rem;

  .picker-label {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    color: ${darkGrey};
    margin-bottom: 0.5rem;
    text-align: center;
  }
`;

export const PickerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const AvatarOption = styled.button`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 2px solid ${({ $selected }) => ($selected ? orange600 : lightGrey)};
  background: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, transform 0.15s;
  background: ${({ $backgroundColor }) => $backgroundColor};

  &:hover {
    border-color: ${orange600};
    transform: scale(1.1);
  }

  img {
    width: 70%;
    height: 70%;
  }
`;

export const ColorOption = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 50%;
  border: 2px solid ${({ $selected }) => ($selected ? orange600 : lightGrey)};
  cursor: pointer;
  padding: 0;
  transition: border-color 0.2s, transform 0.15s;
  transform: ${({ $selected }) => ($selected ? "scale(1.2)" : "none")};

  &:hover {
    border-color: ${orange600};
    transform: scale(1.2);
  }
`;

export const AvatarPreview = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto 0;
  background: ${({ $backgroundColor }) => $backgroundColor};

  img {
    width: 70%;
    height: 70%;
  }
`;
