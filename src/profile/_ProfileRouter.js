import { PrivateRoute } from "../PrivateRoute";
import { Switch } from "react-router-dom";
import * as s from "../components/ColumnWidth.sc";
import UserProfile from "./UserProfile";

export default function ProfileRouter() {
  return (
    <s.NarrowColumn>
      <Switch>
        <PrivateRoute exact path="/profile/:friendUserId" component={UserProfile} />
        <PrivateRoute exact path="/profile" component={UserProfile} />
      </Switch>
    </s.NarrowColumn>
  );
}
