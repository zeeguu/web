import { useEffect } from "react";
import DeleteAccountButton from "../../DeleteAccount/DeleteAccountButton";
import PreferencesPage from "../../_pages_shared/PreferencesPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import strings from "../../../i18n/definitions";
import { setTitle } from "../../../assorted/setTitle";

export default function DeleteAccount() {
  useEffect(() => {
    setTitle(strings.deleteAccount);
  }, []);

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <SettingsPageHeader title={strings.deleteAccount} />
      <Main>
        <DeleteAccountButton />
      </Main>
    </PreferencesPage>
  );
}
