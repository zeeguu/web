import DeleteAccountButton from "../DeleteAccountButton";
import InfoPage from "../info_page_shared/InfoPage";
import Main from "../info_page_shared/Main";
import Header from "../info_page_shared/Header";
import Heading from "../info_page_shared/Heading";

import BackArrow from "./settings_pages_shared/BackArrow";

import strings from "../../i18n/definitions";

export default function DeleteAccount() {
  return (
    <InfoPage pageLocation={"settings"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.deleteAccount}</Heading>
      </Header>
      <Main>
        <DeleteAccountButton />
      </Main>
    </InfoPage>
  );
}
