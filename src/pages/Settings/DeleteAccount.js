import { useEffect } from "react";
import DeleteAccountButton from "../DeleteAccount/DeleteAccountButton";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";
import { setTitle } from "../../assorted/setTitle";
import { HeaderWrapper, BackArrowWrapper } from "./Settings.sc";

export default function DeleteAccount() {
  useEffect(() => {
    setTitle(strings.deleteAccount);
  }, []);

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <HeaderWrapper>
        <BackArrowWrapper>
          <BackArrow />
        </BackArrowWrapper>
        <Header withoutLogo>
          <Heading>{strings.deleteAccount}</Heading>
        </Header>
      </HeaderWrapper>
      <Main>
        <DeleteAccountButton />
      </Main>
    </PreferencesPage>
  );
}
