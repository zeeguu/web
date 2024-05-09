import { isSupportedBrowser } from "../utils/misc/browserDetection";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Button from "./info_page_shared/Button";
import ButtonContainer from "./info_page_shared/ButtonContainer";

import redirect from "../utils/routing/routing";

export default function ExcludeWordsStep1({ hasExtension }) {
  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  return (
    <InfoPage>
      <Header>
        <Heading>
          Would you like to filter out<br></br>articles and exercises containing
          particular words or&nbsp;phrases?
        </Heading>
      </Header>
      <Main>
        <p>You can always change it later</p>
        <ButtonContainer>
          <Button onClick={() => redirect("/exclude_words_step2")}>
            Yes, please
          </Button>
          <Button onClick={() => redirect(getLinkToNextPage())}>
            No, thank you
          </Button>
        </ButtonContainer>
      </Main>
    </InfoPage>
  );
}
