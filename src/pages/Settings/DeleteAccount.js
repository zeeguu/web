import DeleteAccountButton from "../DeleteAccount/DeleteAccountButton";
import InfoPage from "../_pages_shared/InfoPage";
import Main from "../_pages_shared/Main";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";

export default function DeleteAccount() {
  return (
    <InfoPage layoutVariant={"minimalistic-top-aligned"}>
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
