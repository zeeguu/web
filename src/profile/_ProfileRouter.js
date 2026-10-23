import { PrivateRoute } from "../PrivateRoute";
import { Redirect, Switch } from "react-router-dom";
import UserProfile from "./UserProfile";
import { FRIEND_PROFILE_TAB_PATH, OWN_PROFILE_TAB_PATH } from "./profileTabRoutes";

export default function ProfileRouter() {
  return (
    // No column of its own: the profile uses Settings' CardPage frame, which
    // sets the width (inside a narrower column its max-width: 80% shrinks it).
    <Switch>
      <PrivateRoute exact path={OWN_PROFILE_TAB_PATH} component={UserProfile} />
      <PrivateRoute exact path={FRIEND_PROFILE_TAB_PATH} component={UserProfile} />
      <PrivateRoute exact path="/profile/:friendUsername" component={UserProfile} />
      {/* Leaderboards exist only on your own profile, so any other tab slug
            under a username falls back to that profile's default tab. */}
      <Redirect from="/profile/:friendUsername/:profileTab" to="/profile/:friendUsername" />
      <PrivateRoute exact path="/profile" component={UserProfile} />
    </Switch>
  );
}
