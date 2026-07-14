import { Switch, Route, Redirect } from "react-router-dom";
import KioskFeed from "./KioskFeed";
import KioskLayout from "./KioskLayout";
import CornerTapExit from "./CornerTapExit";

// The entire router when kiosk mode is active. The only destination is the
// scrollable feed of summary cards — there is no article reader and nothing
// else is reachable; every other path redirects to the feed. This mounts only
// when a session already exists (see MainAppRouter), so there is no
// login/onboarding surface to reach.
export default function KioskRouter() {
  return (
    <KioskLayout>
      <Switch>
        <Route path="/articles" exact component={KioskFeed} />
        <Route path="*" render={() => <Redirect to="/articles" />} />
      </Switch>
      <CornerTapExit />
    </KioskLayout>
  );
}
