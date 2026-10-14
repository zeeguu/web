import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { UserContext } from "../../contexts/UserContext";
import NavOption from "./NavOption";
import NavigationOptions, { isNavOptionActive } from "./navigationOptions";
import strings from "../../i18n/definitions";

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

// The username row at the bottom of the nav. Settings has no row of its own:
// it is reached from the profile page, and Log out from Settings.
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

  useEffect(() => {
    setAvatarCharacterId(validatedAvatarCharacterId(userDetails.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
  }, [userDetails]);

  return (
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
  );
}
