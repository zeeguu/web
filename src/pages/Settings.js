import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { setTitle } from "../assorted/setTitle";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import { PageTitle } from "../components/PageTitle";

import SettingsItem from "./settings_pages_shared/SettingsItem";
import ListOfSettingsItems from "./settings_pages_shared/ListOfSettingsItems";

import * as s from "./Settings.sc";

export default function Settings() {
  const user = useContext(UserContext);

  const [uiLanguage, setUiLanguage] = useState();

  useEffect(() => {
    const language = LocalStorage.getUiLanguage();
    setUiLanguage(language);
    setTitle(strings.settings);
    // eslint-disable-next-line
  }, []);

  return (
    <s.StyledWrapper>
      <PageTitle>{strings.settings}</PageTitle>

      <ListOfSettingsItems header={"My Account"}>
        <SettingsItem path={"/account_settings/profile_details"}>
          {strings.profileDetails}
        </SettingsItem>
        <SettingsItem path={"/account_settings/languages"}>
          {strings.languages}
        </SettingsItem>

        {!user.is_teacher && (
          <SettingsItem path={"/account_settings/current_class"}>
            {strings.myCurrentClass}
          </SettingsItem>
        )}
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Exercise Preferences"}>
        <SettingsItem path={"/account_settings/audio_exercises"}>
          {strings.audioExercises}
        </SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Reading Preferences"}>
        <SettingsItem path={"/account_settings/interests"}>
          {strings.interests}
        </SettingsItem>
        <SettingsItem path={"/account_settings/non_interests"}>
          {strings.nonInterests}
        </SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Account Management"}>
        <SettingsItem path={"/account_settings/delete_account"}>
          {strings.deleteAccount}
        </SettingsItem>
      </ListOfSettingsItems>
    </s.StyledWrapper>
  );
}
