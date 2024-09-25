import { isSupportedBrowser } from "../../utils/misc/browserDetection";

import useUnwantedContentPreferences from "../../hooks/useUnwantedContentPreferences";
import useFormField from "../../hooks/useFormField";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import Main from "../_pages_shared/Main";
import Form from "../_pages_shared/Form";
import { Button } from "../_pages_shared/Button.sc";
import Footer from "../_pages_shared/Footer";
import ButtonContainer from "../_pages_shared/ButtonContainer";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import InputField from "../../components/InputField";
import Tag from "../_pages_shared/Tag";
import TagContainer from "../_pages_shared/TagContainer";

import redirect from "../../utils/routing/routing";
import strings from "../../i18n/definitions";

export default function ExcludeWordsStep2({ api, hasExtension }) {
  const { unwantedKeywords, addUnwantedKeyword, removeUnwantedKeyword } =
    useUnwantedContentPreferences(api);

  const [excludedWord, handleExcludedWordsChange, resetExcludedWords] =
    useFormField("");

  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  function handleAddNewSearchFilter(e) {
    e.preventDefault();
    if (excludedWord) {
      addUnwantedKeyword(excludedWord);
      resetExcludedWords();
    }
  }

  return (
    <PreferencesPage>
      <Header>
        <Heading>
          Here you can add<br></br> unwanted words or&nbsp;phrases
        </Heading>
      </Header>
      <Main>
        <Form>
          <InputField
            value={excludedWord}
            onChange={handleExcludedWordsChange}
            helperText={strings.addUnwantedWordHelperText}
            placeholder={strings.unwantedWordPlaceholder}
          >
            <Button
              className="small-square-btn"
              onClick={handleAddNewSearchFilter}
            >
              <AddRoundedIcon />
            </Button>
          </InputField>
        </Form>
        <TagContainer>
          {unwantedKeywords.map((keyword) => (
            <div key={keyword.id} id={keyword.id}>
              <Tag
                className={"outlined-blue small"}
                onClick={() => removeUnwantedKeyword(keyword)}
              >
                {keyword.search}
                <HighlightOffRoundedIcon fontSize="small" />
              </Tag>
            </div>
          ))}
        </TagContainer>
      </Main>
      <Footer>
        <p>{strings.youCanChangeLater}</p>
        <ButtonContainer className={"padding-large"}>
          <Button
            className={"full-width-btn"}
            onClick={() => redirect(getLinkToNextPage())}
          >
            {strings.next} <ArrowForwardRoundedIcon />
          </Button>
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
