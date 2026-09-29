import styled from "styled-components";
import { AvatarBackground } from "../profile/UserProfile.sc";

const BaseBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
`;
const TopBarContainer = styled(BaseBanner)`
  background: var(--streak-banner-bg);
  color: var(--streak-banner-text);
  border-bottom: 1px solid var(--streak-banner-border);
  cursor: default;
  justify-content: space-between;

  /* Rides the same scroll gesture as the tab row below it, so the language
     switcher is one pull-down away from anywhere in a feed instead of a scroll
     back to the top. Above TopTabsWrapper's z-index 10, since TopTabs parks
     itself directly underneath via --top-bar-height. */
  position: sticky;
  top: 0;
  z-index: 11;
  transition: transform 0.3s ease-in-out;

  &.header--hidden {
    transform: translateY(-100%);
  }
`;

const FlagButton = styled.button`
  background: none;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const StreakInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;
const DailyFeedbackBannerContainer = styled(BaseBanner)`
  background: var(--feedback-banner-bg);
  color: var(--feedback-banner-text);
  border-bottom: 1px solid var(--feedback-banner-border);

  &:hover {
    background: var(--feedback-banner-hover);
  }

  a {
    color: inherit;
  }
`;

const StreakValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
`;

const StreakLabel = styled.span`
  font-weight: 400;
`;

const FlagImage = styled.img`
  width: 1.4rem;
  height: 1.4rem;
  vertical-align: middle;
  border-radius: 50%;
  object-fit: cover;
  border: 0.05rem solid var(--border-color);
`;

const DailyFeedbackLink = styled.a`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--feedback-banner-text);
  background: var(--feedback-banner-bg);
  padding: 0.2rem 0.6rem;
  border-radius: 0.8rem;
  text-decoration: none;

  &:hover {
    background: var(--feedback-banner-hover);
  }
`;

const ProfileAvatarButton = styled.button`
  background: none;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  flex-shrink: 0;
`;

const TopBarNavAvatar = styled(AvatarBackground)`
  width: 1.8rem;
  height: 1.8rem;
  padding: 2px;
`;

export { TopBarContainer, StreakValue, StreakLabel, FlagImage, FlagButton, StreakInfo, DailyFeedbackBannerContainer, DailyFeedbackLink, ProfileAvatarButton, TopBarNavAvatar };
