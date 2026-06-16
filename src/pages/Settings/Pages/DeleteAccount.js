import { useEffect } from "react";
import DeleteAccountButton from "../../DeleteAccount/DeleteAccountButton";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import strings from "../../../i18n/definitions";
import { setTitle } from "../../../assorted/setTitle";

export default function DeleteAccount() {
  useEffect(() => {
    setTitle(strings.deleteAccount);
  }, []);

  return (
    <CardPage layoutVariant={"minimalistic-top-aligned"} isTransparent reducedPadding>
      <SettingsPageHeader title={strings.deleteAccount} />
      <Main>
        <DeleteAccountButton />
      </Main>
    </CardPage>
  );
}
