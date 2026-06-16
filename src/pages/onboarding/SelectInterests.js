import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { isSupportedBrowser } from "../../utils/misc/browserDetection";
import useSelectInterest from "../../hooks/useSelectInterest";
import CardPage from "../_pages_shared/CardPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Footer from "../_pages_shared/Footer.sc";
import Button from "../_pages_shared/Button.sc";
import Tag from "../_pages_shared/Tag.sc";
import TagContainer from "../_pages_shared/TagContainer.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import strings from "../../i18n/definitions";

import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";

export default function SelectInterests({ hasExtension }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const { allTopics, toggleTopicSubscription, isSubscribed } = useSelectInterest(api);

  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  useEffect(() => {
    setTitle(strings.selectInterests);
  }, []);

  return (
    <CardPage isBackgroundFixed={true}>
      <Header>
        <Heading>What would you like to read&nbsp;about?</Heading>
      </Header>
      <Main>
        <TagContainer>
          {allTopics.map((topic) => (
            <Tag
              key={topic.id}
              className={isSubscribed(topic) && "selected"}
              onClick={() => toggleTopicSubscription(topic)}
            >
              {topic.title}
            </Tag>
          ))}
        </TagContainer>
      </Main>
      <Footer>
        <p className="centered">{strings.youCanChangeLater}</p>
        <ButtonContainer className={"padding-large"}>
          <Button className={"full-width-btn"} onClick={() => history.push(getLinkToNextPage())}>
            {strings.next}
            <RoundedForwardArrow />
          </Button>
        </ButtonContainer>
      </Footer>
    </CardPage>
  );
}
