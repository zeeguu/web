import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { setTitle } from "../assorted/setTitle";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import { PageTitle } from "../components/PageTitle";

import SettingsItem from "./settings_pages_shared/SettingsItem";
import ListOfSettingsItems from "./settings_pages_shared/ListOfSettingsItems";

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
    <>
      <PageTitle>{strings.settings}</PageTitle>

      <ListOfSettingsItems header={"My Account"}>
        <SettingsItem path={"/account_settings/profile_details"}>
          Profile Details
        </SettingsItem>
        <SettingsItem path={"/account_settings/languages"}>
          Languages
        </SettingsItem>

        {!user.is_teacher && (
          <SettingsItem path={"/account_settings/current_class"}>
            My Current Class
          </SettingsItem>
        )}
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Exercise Preferences"}>
        <SettingsItem path={"/account_settings/audio_exercises"}>
          Audio Exercises
        </SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Reading Preferences"}>
        <SettingsItem path={"/account_settings/interests"}>
          Interests
        </SettingsItem>
        <SettingsItem path={"/account_settings/non_interests"}>
          Non-Interests
        </SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Account Management"}>
        <SettingsItem path={"/account_settings/delete_account"}>
          Delete Account
        </SettingsItem>
      </ListOfSettingsItems>
    </>
  );
}
