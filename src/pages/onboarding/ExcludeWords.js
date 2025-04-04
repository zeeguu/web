import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { isSupportedBrowser } from "../../utils/misc/browserDetection";

import useUnwantedContentPreferences from "../../hooks/useUnwantedContentPreferences";
import useFormField from "../../hooks/useFormField";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import Button from "../_pages_shared/Button.sc";
import Footer from "../_pages_shared/Footer.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import InputField from "../../components/InputField";
import Tag from "../_pages_shared/Tag.sc";
import TagContainer from "../_pages_shared/TagContainer.sc";

import strings from "../../i18n/definitions";
import { setTitle } from "../../assorted/setTitle";
import { NonEmptyValidator } from "../../utils/ValidatorRule/Validator";
import { APIContext } from "../../contexts/APIContext";

export default function ExcludeWords({ hasExtension }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const { unwantedKeywords, addUnwantedKeyword, removeUnwantedKeyword } =
    useUnwantedContentPreferences(api);

  const [
    excludedWord,
    setExcludedWord,
    validateExcludedWord,
    isExcludedWordValid,
    excludedWordErrorMsg,
    resetExcludedWords,
  ] = useFormField("", [NonEmptyValidator("Please write a keyword.")]);

  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  function handleAddNewSearchFilter(e) {
    e.preventDefault();
    if (validateExcludedWord()) {
      addUnwantedKeyword(excludedWord);
      resetExcludedWords();
    }
  }

  useEffect(() => {
    setTitle(strings.excludeWords);
  }, []);

  return (
    <PreferencesPage>
      <Header>
        <Heading>
          Would you like to exclude articles and exercises containing particular
          words or&nbsp;phrases?
        </Heading>
      </Header>
      <Main>
        <Form>
          <InputField
            value={excludedWord}
            onChange={(e) => {
              setExcludedWord(e.target.value);
            }}
            helperText={strings.addUnwantedWordHelperText}
            placeholder={strings.unwantedWordPlaceholder}
            isError={!isExcludedWordValid}
            errorMessage={excludedWordErrorMsg}
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
        <p className="centered">{strings.youCanChangeLater}</p>
        <ButtonContainer className={"padding-large"}>
          <Button
            className={"full-width-btn"}
            onClick={() => history.push(getLinkToNextPage())}
          >
            {strings.next} <RoundedForwardArrow />
          </Button>
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
