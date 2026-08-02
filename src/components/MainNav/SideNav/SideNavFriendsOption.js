import { useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

import NavOption from "../NavOption";
import NavigationOptions from "../navigationOptions";
import NotificationIcon from "../../NotificationIcon";
import Feature from "../../../features/Feature";
import { FriendRequestContext } from "../../../contexts/FriendRequestContext";

// Desktop entry point to the social area (/friends). Mirrors the mobile
// top-bar friend icon: its dot is scoped to pending friend requests only —
// badges/achievements live on the profile dot, shared articles on the reading
// inbox. One destination, one clearly-owned signal.
export default function SideNavFriendsOption({ screenWidth }) {
  const path = useLocation().pathname;
  const { hasFriendRequestNotification, friendRequestCount } = useContext(FriendRequestContext);

  if (!Feature.has_gamification()) {
    return null;
  }

  return (
    <NavOption
      {...NavigationOptions.friends}
      currentPath={path}
      screenWidth={screenWidth}
      notification={
        hasFriendRequestNotification && <NotificationIcon position={"top"} text={friendRequestCount} />
      }
    />
  );
}
