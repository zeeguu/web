import { PrivateRoute } from "../../PrivateRoute";
import { Switch } from "react-router-dom";

import Settings from "./Settings";
import ProfileDetails from "./ProfileDetails";
import Languages from "./Languages";
import Interests from "./Interests";
import ExerciseTypePreferences from "./ExerciseTypePreferences";
import Classrooms from "./Classrooms/Classrooms";
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
        path="/account_settings/language_settings"
        api={api}
        setUser={setUser}
        component={Languages}
      />

      <PrivateRoute
        path="/account_settings/exercise_type_preferences"
        api={api}
        component={ExerciseTypePreferences}
      />

      <PrivateRoute
        path="/account_settings/my_classrooms"
        api={api}
        component={Classrooms}
      />

      <PrivateRoute
        path="/account_settings/interests"
        api={api}
        component={Interests}
      />

      <PrivateRoute
        path="/account_settings/delete_account"
        component={DeleteAccount}
      />
    </Switch>
  );
}
