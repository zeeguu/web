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
  width: 2rem;
  height: 2rem;
  padding: 3px;
`;

export default function SideNavProfileOption({ screenWidth, onClick = () => {} }) {
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
      overflowEnabled={true}
      onClick={onClick}
      icon={
        <NavAvatar
          $backgroundColor={avatarBackgroundColor}
          $isActive={isNavOptionActive(NavigationOptions.profile.linkTo, path)}
        >
          <AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
        </NavAvatar>
      }
      text={
        <div
          style={{
            color: isActive ? avatarCharacterColor : undefined,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {userDetails?.username || "Profile"}
        </div>
      }
      currentPath={path}
      screenWidth={screenWidth}
      notification={
        (hasBadgeNotification || hasFriendRequestNotification) && (
          <NotificationIcon position={"top"} text={totalNumberOfBadges + friendRequestCount} />
        )
      }
    />
  );
}
