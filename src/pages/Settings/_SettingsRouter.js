import { PrivateRoute } from "../../PrivateRoute";
import { Switch } from "react-router-dom";

import Settings from "./Settings";
import ProfileDetails from "./ProfileDetails";
import LanguageSettings from "./LanguageSettings";
import Interests from "./Interests";
import ExerciseTypePreferences from "./ExerciseTypePreferences";
import MyClassrooms from "./MyClassrooms/MyClassrooms";
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
        component={LanguageSettings}
      />

      <PrivateRoute
        path="/account_settings/exercise_type_preferences"
        api={api}
        component={ExerciseTypePreferences}
      />

      <PrivateRoute
        path="/account_settings/my_classrooms"
        api={api}
        component={MyClassrooms}
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
