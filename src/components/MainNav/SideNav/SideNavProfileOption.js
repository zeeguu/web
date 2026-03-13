import { useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import styled from "styled-components";

import { UserContext } from "../../../contexts/UserContext";
import NavOption from "../NavOption";
import NavigationOptions, { isNavOptionActive } from "../navigationOptions";

import { AvatarBackground, AvatarImage } from "../../../profile/UserProfile.sc";
import { orange100, orange600 } from "../../colors";
import { BadgeCounterContext } from "@/badges/BadgeCounterContext";
import NotificationIcon from "@/components/NotificationIcon";


const NavAvatar = styled(AvatarBackground)`
  width: ${({ $screenWidth }) => ($screenWidth < 768 ? "1.4rem" : "1.8rem")};
  height: ${({ $screenWidth }) => ($screenWidth < 768 ? "1.4rem" : "1.8rem")};
  padding: 2px;
`;

export default function SideNavProfileOption({ screenWidth }) {
  const { userDetails } = useContext(UserContext);
  const path = useLocation().pathname;
  const isActive = isNavOptionActive(NavigationOptions.profile.linkTo, path);
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);


  return (
    <NavOption
      linkTo={NavigationOptions.profile.linkTo}
      icon={
        <NavAvatar
          $screenWidth={screenWidth}
          $backgroundColor={userDetails.user_avatar?.background_color || orange100}
          $isActive={isNavOptionActive(NavigationOptions.profile.linkTo, path)}
        >
          <AvatarImage
            $imageSource={`/static/avatars/${userDetails.user_avatar?.image_name || "elephant.svg"}`}
            $color={userDetails.user_avatar?.character_color || orange600}
          />
        </NavAvatar>
      }
      text={
        <span style={{ color: isActive ? userDetails.user_avatar?.character_color || orange600 : undefined }}>
          {userDetails?.username || "Profile"}
        </span>
      }
      currentPath={path}
      screenWidth={screenWidth}
      notification={
          hasBadgeNotification && <NotificationIcon position={"top-absolute"} text={totalNumberOfBadges} />
        }
    />
  );
}
