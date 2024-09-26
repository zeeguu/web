import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import Main from "../_pages_shared/Main";
import ButtonContainer from "../_pages_shared/ButtonContainer";
import Footer from "../_pages_shared/Footer";
import { Button } from "../_pages_shared/Button.sc";
import FullWidthImage from "../../components/FullWidthImage";
import { getExtensionInstallationLinks } from "../../utils/extension/extensionInstallationLinks";
import { getExtensionInstallationButtonContent } from "../../utils/extension/extensionInstallationButtonContent";
import { runningInChromeDesktop } from "../../utils/misc/browserDetection";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import strings from "../../i18n/definitions";
import redirect from "../../utils/routing/routing";

export default function InstallExtension() {
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
        <FullWidthImage src={"find-extension.png"} />
        {runningInChromeDesktop() && (
          <p>
            * Also compatible with <b>Edge</b>, <b>Opera</b>, <b>Vivaldi</b>,
            and <b>Brave</b>. <br></br> Not seeing your browser? The extension
            may still work - try installing it!
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
            <ArrowForwardRoundedIcon fontSize="medium" />
          </Button>
          <a className="link" href="/articles">
            {strings.iWillInstallLater}
          </a>
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
