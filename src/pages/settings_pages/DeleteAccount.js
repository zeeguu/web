import DeleteAccountButton from "../DeleteAccountButton";
import InfoPage from "../info_page_shared/InfoPage";

import BackArrow from "../settings_pages_shared/BackArrow";

import { PageTitle } from "../../components/PageTitle";
import strings from "../../i18n/definitions";

export default function DeleteAccount() {
  return (
    <InfoPage pageLocation={"settings"}>
      <BackArrow />
      <PageTitle>{strings.deleteAccount}</PageTitle>
      <DeleteAccountButton />
    </InfoPage>
  );
}
