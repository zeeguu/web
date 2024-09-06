import DeleteAccountButton from "../DeleteAccount/DeleteAccountButton";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Main from "../_pages_shared/Main";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";

export default function DeleteAccount() {
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.deleteAccount}</Heading>
      </Header>
      <Main>
        <DeleteAccountButton />
      </Main>
    </PreferencesPage>
  );
}
