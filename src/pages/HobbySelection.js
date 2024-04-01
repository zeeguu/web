import { useEffect, useState } from "react";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import { isSupportedBrowser } from "../utils/misc/browserDetection";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";
import HobbyTag from "./info_page_shared/HobbyTag";
import HobbyContainer from "./info_page_shared/HobbyContainer";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function HobbySelection({ api }) {
  const [hasExtension, setHasExtension] = useState(false);
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [availableTopics, setInterestingTopics] = useState(null);

  useEffect(() => {
    if (isSupportedBrowser()) {
      checkExtensionInstalled(setHasExtension);
    }
  }, []);

  useEffect(() => {
    api.getAvailableTopics((data) => {
      setInterestingTopics(data);
    });
  }, [api]);

  function getLinkToNextStep() {
    let extensionCanBeInstalled = "install_extension";
    let hasExtensionOrNotSupported = "/articles";

    if (isSupportedBrowser() && hasExtension === false) {
      return extensionCanBeInstalled;
    } else return hasExtensionOrNotSupported;
  }

  //when the user changes interests...
  function articlesListShouldChange() {
    setArticleList(null);
    api.getUserArticles((articles) => {
      setArticleList(articles);
      setOriginalList([...articles]);
    });
  }

  return (
    <InfoPage>
      <Header>
        <Heading>What topics are you interested in?</Heading>
      </Header>
      <Main>
        <HobbyContainer>
          {availableTopics?.map((topic) => (
            <HobbyTag>{topic.title}</HobbyTag>
          ))}
        </HobbyContainer>
      </Main>
      <Footer>
        <p>You can always change it later</p>
        <ButtonContainer>
          <Button href={getLinkToNextStep()}>
            Next <ArrowForwardRoundedIcon />
          </Button>
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
