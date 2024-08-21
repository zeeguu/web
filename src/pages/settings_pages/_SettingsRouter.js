import { PrivateRoute } from "../../PrivateRoute";
import { Switch } from "react-router-dom";

import Settings from "../Settings";
import ProfileDetails from "./ProfileDetails";
import Languages from "./Languages";
import Interests from "./Interests";
import AudioExercises from "./AudioExercises";
import CurrentClass from "./CurrentClass";
import DeleteAccount from "./DeleteAccount";

export default function SettingsRouter({ api, setUser }) {
  return (
    <Switch>
      <PrivateRoute
        path="/account_settings/options"
        api={api}
        setUser={setUser}
        component={Settings}
      />

      <PrivateRoute
        path="/account_settings/profile_details"
        api={api}
        setUser={setUser}
        component={ProfileDetails}
      />

      <PrivateRoute
        path="/account_settings/languages"
        api={api}
        setUser={setUser}
        component={Languages}
      />

      <PrivateRoute
        path="/account_settings/audio_exercises"
        api={api}
        setUser={setUser}
        component={AudioExercises}
      />

      <PrivateRoute
        path="/account_settings/current_class"
        api={api}
        setUser={setUser}
        component={CurrentClass}
      />

      <PrivateRoute
        path="/account_settings/interests"
        api={api}
        setUser={setUser}
        component={Interests}
      />

      <PrivateRoute
        path="/account_settings/delete_account"
        api={api}
        setUser={setUser}
        component={DeleteAccount}
      />
    </Switch>
  );
}
