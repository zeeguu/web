import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import Main from "../_pages_shared/Main";
import ButtonContainer from "../_pages_shared/ButtonContainer";
import Footer from "../_pages_shared/Footer";
import Button from "../_pages_shared/Button";
import FullWidthImage from "../../components/FullWidthImage";
import { getExtensionInstallationLinks } from "../../utils/extension/extensionInstallationLinks";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import strings from "../../i18n/definitions";
import redirect from "../../utils/routing/routing";

export default function InstallExtension() {
  return (
    <PreferencesPage>
      <Header>
        <Heading>You're almost there</Heading>
      </Header>
      <Main>
        <p>
          Time to install The Zeeguu Reader browser extension, which enables you
          to&nbsp;read and translate articles and solve&nbsp;exercises
        </p>
        <FullWidthImage src={"find-extension.png"} />
      </Main>
      <Footer>
        <ButtonContainer className={"padding-large"}>
          <Button
            className={"full-width-btn"}
            onClick={() => redirect(getExtensionInstallationLinks())}
          >
            <FileDownloadOutlinedIcon fontSize="small" />
            {strings.installTheExtension}
          </Button>
          <a className="link" href="/articles">
            {strings.iWillInstallLater}
          </a>
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
