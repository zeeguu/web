import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import styled from "styled-components";

import { UserContext } from "../../contexts/UserContext";
import NavOption from "./NavOption";
import NavigationOptions, { isNavOptionActive } from "./navigationOptions";
import strings from "../../i18n/definitions";
import { isDesktopScreenWidth, isMediumScreenWidth } from "./screenSize";

import { AvatarBackground, AvatarImage } from "../../profile/UserProfile.sc";
import {
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "../../profile/avatarOptions";
import { BadgeCounterContext } from "../../contexts/BadgeCounterContext";
import NotificationIcon from "../NotificationIcon";
import { FriendRequestContext } from "../../contexts/FriendRequestContext";

const NavAvatar = styled(AvatarBackground)`
  width: 2rem;
  height: 2rem;
  padding: 3px;
`;

const Username = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`;

// Sits over the right end of the username row: a sibling of the row's link,
// since a link cannot hold another link.
const SettingsGear = styled(Link)`
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  color: ${({ theme }) => theme.btnContentDefault};
  opacity: 0.7;

  @media (hover: hover) {
    &:hover {
      opacity: 1;
    }
  }
`;

// The username row at the bottom of the nav. Settings has no row of its own:
// on the full-width sidebar a gear at the end of this row leads there (the
// phone has one in the top bar), and Log out is at the bottom of Settings.
export default function AccountNavOption({ screenWidth, onNavigate = () => {} }) {
  const { userDetails } = useContext(UserContext);
  const path = useLocation().pathname;
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);
  const { hasFriendRequestNotification, friendRequestCount } = useContext(FriendRequestContext);
  const [avatarCharacterId, setAvatarCharacterId] = useState();
  const [avatarCharacterColor, setAvatarCharacterColor] = useState();
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState();

  // A guest has no profile yet, and the Settings page is where they can
  // create the account, so their avatar leads there.
  const linkTo = userDetails?.is_anonymous ? NavigationOptions.settings.linkTo : NavigationOptions.profile.linkTo;
  const isActive =
    isNavOptionActive(NavigationOptions.profile.linkTo, path) ||
    isNavOptionActive(NavigationOptions.settings.linkTo, path);

  // The collapsed sidebar has no room beside the avatar: Settings gets its
  // own icon row there instead.
  const showGear = isDesktopScreenWidth(screenWidth);
  const showSettingsRow = isMediumScreenWidth(screenWidth);

  useEffect(() => {
    setAvatarCharacterId(validatedAvatarCharacterId(userDetails.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
  }, [userDetails]);

  return (
    <>
      <NavOption
        overflowEnabled={true}
        className={showGear ? "withTrailing" : undefined}
        linkTo={linkTo}
        isActive={isActive}
        onClick={onNavigate}
        icon={
          <NavAvatar $backgroundColor={avatarBackgroundColor} $isActive={isActive}>
            <AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
          </NavAvatar>
        }
        text={
          <Username style={{ color: isActive ? avatarCharacterColor : undefined }}>
            {userDetails?.username || strings.titleOwnProfile}
          </Username>
        }
        screenWidth={screenWidth}
        trailing={
          showGear && (
            <SettingsGear to={NavigationOptions.settings.linkTo} aria-label={strings.settings} title={strings.settings}>
              <SettingsRoundedIcon />
            </SettingsGear>
          )
        }
        notification={
          (hasBadgeNotification || hasFriendRequestNotification) && (
            <NotificationIcon position={"top"} text={totalNumberOfBadges + friendRequestCount} />
          )
        }
      />
      {showSettingsRow && <NavOption {...NavigationOptions.settings} currentPath={path} screenWidth={screenWidth} />}
    </>
  );
}
