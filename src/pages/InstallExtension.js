import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";
import { getExtensionInstallationLinks } from "../utils/misc/extensionInstallationLinks";
import MainImage from "./info_page_shared/MainImage";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function InstallExtension() {
  return (
    <InfoPage>
      <Header>
        <Heading>You're almost there</Heading>
      </Header>
      <Main>
        <p>
          Time to install The Zeeguu Reader browser extension, which enables you
          to&nbsp;read and translate articles and solve exercises
        </p>
        <MainImage src={"../static/images/find-extension.png"} />
      </Main>
      <Footer>
        <ButtonContainer contentAlignment={"vertical"}>
          <Button href={getExtensionInstallationLinks()}>
            <FileDownloadOutlinedIcon fontSize="small" />
            Install the Extension
          </Button>
          <a className="link" href="/articles">
            Skip installation
          </a>
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
