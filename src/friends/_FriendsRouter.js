import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";

import TopTabs from "../components/TopTabs";
import NotificationIcon from "../components/NotificationIcon";
import * as columnS from "../components/ColumnWidth.sc";

import Friends from "./Friends";
import Leaderboards from "../leaderboards/Leaderboards";

import { FriendRequestContext } from "../contexts/FriendRequestContext";
import LocalStorage from "../assorted/LocalStorage";

// The "social" destination of the app: your friends (list + requests + search)
// and the leaderboards that rank you against them. Split out of the profile
// page so the profile can stay about *you* (identity + badges) while everything
// relational lives here, one tap from the top-bar friend icon.
//
// Note on scope: the "shared articles" inbox is intentionally NOT here — shared
// articles are *content*, so they live with the rest of your reading on the
// homepage. This page is people, not content. (See the notification-center
// discussion for how the two relate.)
export default function FriendsRouter() {
  const history = useHistory();
  const { hasFriendRequestNotification, friendRequestCount } = useContext(FriendRequestContext);

  // Tapping a friend (in either tab) opens their profile.
  const goToProfile = (username) =>
    history.push(username ? `/profile/${encodeURIComponent(username)}` : "/profile");

  const friendsTabLabel = (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      Friends
      {hasFriendRequestNotification && (
        <NotificationIcon position={"top"} text={friendRequestCount} />
      )}
    </span>
  );

  const tabs = [
    { text: friendsTabLabel, link: "/friends" },
    { text: "Leaderboards", link: "/friends/leaderboards" },
  ];

  return (
    <columnS.NarrowColumn>
      <TopTabs title={"Friends"} tabsAndLinks={tabs} hasBackground={false} isCompact={true} />

      <PrivateRoute exact path="/friends" component={Friends} navigationHandler={goToProfile} />
      <PrivateRoute
        exact
        path="/friends/leaderboards"
        component={Leaderboards}
        isStudent={LocalStorage.isStudent()}
        navigationHandler={goToProfile}
      />
    </columnS.NarrowColumn>
  );
}
