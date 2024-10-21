import { useEffect } from "react";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Footer from "../_pages_shared/Footer.sc";
import Button from "../_pages_shared/Button.sc";
import FullWidthImage from "../../components/FullWidthImage";
import { getExtensionInstallationLinks } from "../../utils/extension/extensionInstallationLinks";
import { getExtensionInstallationButtonContent } from "../../utils/extension/extensionInstallationButtonContent";
import { runningInChromeDesktop } from "../../utils/misc/browserDetection";

import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";

import strings from "../../i18n/definitions";
import redirect from "../../utils/routing/routing";
import { setTitle } from "../../assorted/setTitle";

export default function InstallExtension() {
  useEffect(() => {
    setTitle(strings.installExtension);
  }, []);

  return (
    <PreferencesPage>
      <Header>
        <Heading>
          Read and translate foreign&nbsp;articles<br></br>
          with&nbsp;the&nbsp;Zeeguu browser&nbsp;
          {runningInChromeDesktop() ? "extension" : "add-on"}
        </Heading>
      </Header>
      <Main>
        <FullWidthImage src={"translations.png"} />
        {runningInChromeDesktop() && (
          <p>
            The Chrone Web Store extension also works in <b>Edge</b>,{" "}
            <b>Opera</b>, <b>Arc</b>, <b>Vivaldi</b>, and <b>Brave</b> and other
            Chromium based browsers.
          </p>
        )}
      </Main>
      <Footer>
        <ButtonContainer className={"padding-medium"}>
          <Button
            className={"full-width-btn"}
            onClick={() => redirect(getExtensionInstallationLinks())}
          >
            {getExtensionInstallationButtonContent()}
            <RoundedForwardArrow fontSize="medium" />
          </Button>
          <a className="link" href="/articles">
            {strings.iWillInstallLater}
          </a>
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
