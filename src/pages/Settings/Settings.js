import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { setTitle } from "../../assorted/setTitle";
import strings from "../../i18n/definitions";
import { PageTitle } from "../../components/PageTitle";
import SettingsItem from "./settings_pages_shared/SettingsItem";
import SettingsItemButton from "./settings_pages_shared/SettingsItemButton";
import ListOfSettingsItems from "./settings_pages_shared/ListOfSettingsItems";
import LogOutButton from "./LogOutButton";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import UpgradeAccountModal from "../../components/UpgradeAccountModal";
import LocalStorage from "../../assorted/LocalStorage";
import { APP_VERSION } from "../../appVersion";

import * as s from "./Settings.sc";

export default function Settings() {
  const { userDetails } = useContext(UserContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setTitle(strings.settings);
  }, []);

  const isAnonymous = userDetails?.is_anonymous;

  function handleUpgradeSuccess() {
    // Clear the dismissed flag so the modal logic works correctly
    LocalStorage.setAnonUpgradeDismissed(false);
  }

  return (
    <s.StyledWrapper>
      <PageTitle>{strings.settings}</PageTitle>

      {isAnonymous && (
        <ListOfSettingsItems header="Guest Account">
          <SettingsItemButton onClick={() => setShowUpgradeModal(true)}>
            Create Account to Save Progress
          </SettingsItemButton>
        </ListOfSettingsItems>
      )}

      <UpgradeAccountModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={handleUpgradeSuccess}
        triggerReason="settings"
        bookmarkCount={userDetails?.bookmark_count || 0}
      />

      <ListOfSettingsItems header={isAnonymous ? "Language" : strings.myAccount}>
        {!isAnonymous && (
          <SettingsItem path={"/account_settings/profile_details"}>{strings.profileDetails}</SettingsItem>
        )}
        <SettingsItem path={"/account_settings/language_settings"}>{strings.languageSettings}</SettingsItem>

        {!isAnonymous && !userDetails.is_teacher && (
          <SettingsItem path={"/account_settings/my_classrooms"}>{strings.myClassrooms}</SettingsItem>
        )}
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Reading"}>
        <SettingsItem path={"/account_settings/interests"}>{strings.interests}</SettingsItem>
        <SettingsItem path={"/account_settings/filters"}>Filters</SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={strings.exercises}>
        <SettingsItem path={"/account_settings/exercise_types"}>Audio & Pronunciation</SettingsItem>
        <SettingsItem path={"/account_settings/exercise_scheduling"}>Scheduling</SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={strings.topbarProgressDisplay}>
        <SettingsItem path={"/account_settings/topbar_progress_display"}>
          {strings.progressIconPreferences}
        </SettingsItem>
      </ListOfSettingsItems>

      {!isAnonymous && (
        <ListOfSettingsItems header={strings.accountManagement}>
          <SettingsItem path={"/account_settings/delete_account"}>{strings.deleteAccount}</SettingsItem>
        </ListOfSettingsItems>
      )}

      <ButtonContainer className={"adaptive-alignment-horizontal"} style={{marginTop: "1em", marginBottom: "1em"}}>
        <LogOutButton />
      </ButtonContainer>

      <s.Version>v{APP_VERSION}</s.Version>
    </s.StyledWrapper>
  );
}
