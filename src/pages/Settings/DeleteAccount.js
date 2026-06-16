import { useEffect } from "react";
import DeleteAccountButton from "../DeleteAccount/DeleteAccountButton";
import CardPage from "../_pages_shared/CardPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";
import { setTitle } from "../../assorted/setTitle";

export default function DeleteAccount() {
  useEffect(() => {
    setTitle(strings.deleteAccount);
  }, []);

  return (
    <CardPage layoutVariant={"minimalistic-top-aligned"} isTransparent reducedPadding>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.deleteAccount}</Heading>
      </Header>
      <Main>
        <DeleteAccountButton />
      </Main>
    </CardPage>
  );
}
