import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { APIContext } from "../../contexts/APIContext";
import { setTitle } from "../../assorted/setTitle";
import LocalStorage from "../../assorted/LocalStorage";
import strings from "../../i18n/definitions";
import { PageTitle } from "../../components/PageTitle";

import SettingsItem from "./settings_pages_shared/SettingsItem";
import ListOfSettingsItems from "./settings_pages_shared/ListOfSettingsItems";
import useSelectInterest from "../../hooks/useSelectInterest";
import * as s from "./Settings.sc";
import LoadingAnimation from "../../components/LoadingAnimation";

export default function Settings() {
  const user = useContext(UserContext);
  const api = useContext(APIContext);

  const [uiLanguage, setUiLanguage] = useState();

  const { allTopics } = useSelectInterest(api);

  useEffect(() => {
    const language = LocalStorage.getUiLanguage();
    setUiLanguage(language);
    setTitle(strings.settings);
    // eslint-disable-next-line
  }, []);

  if (allTopics === undefined) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  return (
    <s.StyledWrapper>
      <PageTitle>{strings.settings}</PageTitle>

      <ListOfSettingsItems header={strings.myAccount}>
        <SettingsItem path={"/account_settings/profile_details"}>
          {strings.profileDetails}
        </SettingsItem>
        <SettingsItem path={"/account_settings/language_settings"}>
          {strings.languageSettings}
        </SettingsItem>

        {!user.is_teacher && (
          <SettingsItem path={"/account_settings/my_classrooms"}>
            {strings.myClassrooms}
          </SettingsItem>
        )}
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Reading Preferences"}>
        {allTopics.length > 0 && (
          <SettingsItem path={"/account_settings/interests"}>
            {strings.interests}
          </SettingsItem>
        )}

        <SettingsItem path={"/account_settings/excluded_keywords"}>
          {strings.excludedKeywords}
        </SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={strings.exercises}>
        <SettingsItem path={"/account_settings/exercise_type_preferences"}>
          {strings.exerciseTypePreferences}
        </SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={strings.accountManagement}>
        <SettingsItem path={"/account_settings/delete_account"}>
          {strings.deleteAccount}
        </SettingsItem>
      </ListOfSettingsItems>
    </s.StyledWrapper>
  );
}
