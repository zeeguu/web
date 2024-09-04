import { isSupportedBrowser } from "../../utils/misc/browserDetection";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import Main from "../_pages_shared/Main";
import Button from "../_pages_shared/Button";
import ButtonContainer from "../_pages_shared/ButtonContainer";

import redirect from "../../utils/routing/routing";
import strings from "../../i18n/definitions";

export default function ExcludeWordsStep1({ hasExtension }) {
  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  return (
    <PreferencesPage>
      <Header>
        <Heading>
          Would you like to exclude articles and exercises containing particular
          words or&nbsp;phrases?
        </Heading>
      </Header>
      <Main>
        <p>{strings.youCanChangeLater}</p>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
          <Button
            className={"full-width-btn"}
            onClick={() => redirect("/exclude_words_step2")}
          >
            {strings.yesPlease}
          </Button>
          <Button
            className={"full-width-btn"}
            onClick={() => redirect(getLinkToNextPage())}
          >
            {strings.noThankYou}
          </Button>
        </ButtonContainer>
      </Main>
    </PreferencesPage>
  );
}
