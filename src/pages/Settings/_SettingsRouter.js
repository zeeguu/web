import { PrivateRoute } from "../../PrivateRoute";
import { Switch } from "react-router-dom";
import Settings from "./Settings";
import ProfileDetails from "./ProfileDetails";
import LanguageSettings from "./LanguageSettings";
import Interests from "./Interests";
import ExerciseTypePreferences from "./ExerciseTypePreferences";
import MyClassrooms from "./MyClassrooms/MyClassrooms";
import DeleteAccount from "./DeleteAccount";
import ExcludedKeywords from "./ExcludedKeywords";
import TopbarIconPreferences from "./TopbarIconPreferences";
import ExerciseSchedulingPreferences from "./ExerciseSchedulingPreferences";
import TopbarIconPreferences from "./TopbarIconPreferences";



export default function SettingsRouter({ setUser }) {
  return (
    <Switch>
      <PrivateRoute exact path="/account_settings" setUser={setUser} component={Settings} />

      <PrivateRoute path="/account_settings/profile_details" setUser={setUser} component={ProfileDetails} />

      <PrivateRoute path="/account_settings/language_settings" setUser={setUser} component={LanguageSettings} />

      <PrivateRoute
        path="/account_settings/exercise_type_preferences"
        component={ExerciseTypePreferences}
      />

      <PrivateRoute path="/account_settings/exercise_scheduling" component={ExerciseSchedulingPreferences} />
      <PrivateRoute path="/account_settings/topbar_progress_display" component={TopbarIconPreferences}/>


      <PrivateRoute path="/account_settings/topbar_progress_display" component={TopbarIconPreferences}/>

      <PrivateRoute path="/account_settings/my_classrooms" component={MyClassrooms} />

      <PrivateRoute path="/account_settings/interests" component={Interests} />

      <PrivateRoute path="/account_settings/excluded_keywords" component={ExcludedKeywords} />

      <PrivateRoute path="/account_settings/delete_account" component={DeleteAccount} />
    </Switch>
  );
}
