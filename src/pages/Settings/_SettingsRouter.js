import { PrivateRoute } from "../../PrivateRoute";
import { Switch } from "react-router-dom";
import Settings from "./Pages/Settings";
import ProfileDetails from "./Pages/ProfileDetails";
import LanguageSettings from "./Pages/LanguageSettings";
import FeedPreferences from "./Pages/FeedPreferences";
import ExerciseTypePreferences from "./Pages/ExerciseTypePreferences";
import MyClassrooms from "./Pages/MyClassrooms/MyClassrooms";
import DeleteAccount from "./Pages/DeleteAccount";
import ExerciseSchedulingPreferences from "./Pages/ExerciseSchedulingPreferences";
import DisplayPreferences from "./Pages/DisplayPreferences";
import Developer from "./Pages/Developer";

export default function SettingsRouter({ setUser }) {
  return (
    <Switch>
      <PrivateRoute exact path="/account_settings" setUser={setUser} component={Settings} />

      <PrivateRoute path="/account_settings/profile_details" setUser={setUser} component={ProfileDetails} />

      <PrivateRoute path="/account_settings/language_settings" setUser={setUser} component={LanguageSettings} />

      <PrivateRoute path="/account_settings/exercise_types" component={ExerciseTypePreferences} />

      <PrivateRoute path="/account_settings/exercise_scheduling" component={ExerciseSchedulingPreferences} />

      <PrivateRoute path="/account_settings/display" component={DisplayPreferences} />

      <PrivateRoute path="/account_settings/my_classrooms" component={MyClassrooms} />

      <PrivateRoute path="/account_settings/interests" component={FeedPreferences} />

      <PrivateRoute path="/account_settings/delete_account" component={DeleteAccount} />

      <PrivateRoute path="/account_settings/developer" component={Developer} />
    </Switch>
  );
}
