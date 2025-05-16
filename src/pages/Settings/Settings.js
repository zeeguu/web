import { useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { setTitle } from "../../assorted/setTitle";
import strings from "../../i18n/definitions";
import { PageTitle } from "../../components/PageTitle";
import SettingsItem from "./settings_pages_shared/SettingsItem";
import ListOfSettingsItems from "./settings_pages_shared/ListOfSettingsItems";

import * as s from "./Settings.sc";

export default function Settings() {
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    setTitle(strings.settings);
  }, []);

  return (
    <s.StyledWrapper>
      <PageTitle>{strings.settings}</PageTitle>

      <ListOfSettingsItems header={strings.myAccount}>
        <SettingsItem path={"/account_settings/profile_details"}>{strings.profileDetails}</SettingsItem>
        <SettingsItem path={"/account_settings/language_settings"}>{strings.languageSettings}</SettingsItem>

        {!userDetails.is_teacher && (
          <SettingsItem path={"/account_settings/my_classrooms"}>{strings.myClassrooms}</SettingsItem>
        )}
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Reading"}>
        <SettingsItem path={"/account_settings/interests"}>{strings.interests}</SettingsItem>
        <SettingsItem path={"/account_settings/excluded_keywords"}>{strings.excludedKeywords}</SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={strings.exercises}>
        <SettingsItem path={"/account_settings/exercise_types"}>Exercise Types</SettingsItem>
        <SettingsItem path={"/account_settings/exercise_scheduling"}>Scheduling</SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={strings.accountManagement}>
        <SettingsItem path={"/account_settings/delete_account"}>{strings.deleteAccount}</SettingsItem>
      </ListOfSettingsItems>
    </s.StyledWrapper>
  );
}
