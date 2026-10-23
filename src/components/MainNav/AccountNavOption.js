import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { UserContext } from "../../contexts/UserContext";
import NavOption from "./NavOption";
import NavigationOptions, { isNavOptionActive } from "./navigationOptions";
import strings from "../../i18n/definitions";
import { isMobileScreenWidth } from "./screenSize";

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

// The username row at the bottom of the nav, preceded on the sidebar by a
// Settings row (the phone has a gear in the top bar instead). Log out is at
// the bottom of Settings.
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
  const isAnonymous = userDetails?.is_anonymous;
  const linkTo = isAnonymous ? NavigationOptions.settings.linkTo : NavigationOptions.profile.linkTo;
  const isActive =
    isNavOptionActive(NavigationOptions.profile.linkTo, path) ||
    (isAnonymous && isNavOptionActive(NavigationOptions.settings.linkTo, path));

  // Only on the sidebar (the phone's More panel passes no screenWidth), and
  // not for guests, whose avatar row already leads to Settings.
  const showSettingsRow = screenWidth !== undefined && !isMobileScreenWidth(screenWidth) && !isAnonymous;

  useEffect(() => {
    setAvatarCharacterId(validatedAvatarCharacterId(userDetails.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
  }, [userDetails]);

  return (
    <>
      {showSettingsRow && <NavOption {...NavigationOptions.settings} currentPath={path} screenWidth={screenWidth} />}
      <NavOption
        overflowEnabled={true}
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
        notification={
          (hasBadgeNotification || hasFriendRequestNotification) && (
            <NotificationIcon position={"top"} text={totalNumberOfBadges + friendRequestCount} />
          )
        }
      />
    </>
  );
}
