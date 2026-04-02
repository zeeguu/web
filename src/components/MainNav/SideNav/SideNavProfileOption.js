import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import styled from "styled-components";

import { UserContext } from "../../../contexts/UserContext";
import NavOption from "../NavOption";
import NavigationOptions, { isNavOptionActive } from "../navigationOptions";

import { AvatarBackground, AvatarImage } from "../../../profile/UserProfile.sc";
import {
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "../../../profile/avatarOptions";
import { BadgeCounterContext } from "../../../badges/BadgeCounterContext";
import NotificationIcon from "../../../components/NotificationIcon";
import { FriendRequestContext } from "../../../contexts/FriendRequestContext";
import Feature from "../../../features/Feature";

const NavAvatar = styled(AvatarBackground)`
  width: 1.8rem;
  height: 1.8rem;
  padding: 2px;
`;

export default function SideNavProfileOption({ screenWidth }) {
  const { userDetails } = useContext(UserContext);
  const path = useLocation().pathname;
  const isActive = isNavOptionActive(NavigationOptions.profile.linkTo, path);
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);
  const { hasFriendRequestNotification, friendRequestCount } = useContext(FriendRequestContext);
  const [avatarCharacterId, setAvatarCharacterId] = useState();
  const [avatarCharacterColor, setAvatarCharacterColor] = useState();
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState();

  useEffect(() => {
    setAvatarCharacterId(validatedAvatarCharacterId(userDetails.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
  }, [userDetails]);

  if (!Feature.has_gamification()) {
    return null;
  }

  return (
    <NavOption
      linkTo={NavigationOptions.profile.linkTo}
      icon={
        <NavAvatar
          $screenWidth={screenWidth}
          $backgroundColor={avatarBackgroundColor}
          $isActive={isNavOptionActive(NavigationOptions.profile.linkTo, path)}
        >
          <AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
        </NavAvatar>
      }
      text={
        <span
          style={{
            color: isActive ? avatarCharacterColor : undefined,
          }}
        >
          {userDetails?.username || "Profile"}
        </span>
      }
      currentPath={path}
      screenWidth={screenWidth}
      notification={
        (hasBadgeNotification || hasFriendRequestNotification) && (
          <NotificationIcon position={"top-absolute"} text={totalNumberOfBadges + friendRequestCount} />
        )
      }
    />
  );
}
