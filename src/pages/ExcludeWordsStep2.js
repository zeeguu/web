import { isSupportedBrowser } from "../utils/misc/browserDetection";

import useExcludeInterest from "../hooks/useExcludeInterest";
import useFormField from "../hooks/useFormField";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import Button from "./info_page_shared/Button";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import InputField from "./info_page_shared/InputField";
import Tag from "./info_page_shared/Tag";
import TagContainer from "./info_page_shared/TagContainer";

import redirect from "../utils/routing/routing";

export default function ExcludeWordsStep2({ api, hasExtension }) {
  const {
    subscribedSearchFilters,
    subscribeToSearchFilter,
    removeSearchFilter,
    availableFilters,
  } = useExcludeInterest(api);

  const [excludedWords, handleExcludedWordsChange, resetExcludedWords] =
    useFormField("");

  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  function handleAddNewSearchFilter(e) {
    e.preventDefault();
    if (excludedWords) {
      subscribeToSearchFilter(excludedWords);
      resetExcludedWords();
    }
  }

  return (
    <InfoPage>
      <Header>
        <Heading>
          Here you can select or add<br></br> unwanted words or&nbsp;phrases
        </Heading>
      </Header>
      <Main>
        <Form>
          <InputField
            value={excludedWords}
            onChange={handleExcludedWordsChange}
            helperText={"Please enter one word / phrase at a time"}
            placeholder={"e.g. robbery"}
            label={"Add your unwanted words / phrases"}
          >
            <Button className="small-square" onClick={handleAddNewSearchFilter}>
              <AddRoundedIcon />
            </Button>
          </InputField>
        </Form>
        {/* Todo: Create empty state of this */}
        <TagContainer>
          {subscribedSearchFilters.map((search) => (
            <div key={search.id} searchremovabeid={search.id}>
              <Tag
                className={"outlined-blue square"}
                onClick={() => removeSearchFilter(search)}
              >
                {search.search}
                <HighlightOffRoundedIcon fontSize="small" />
              </Tag>
            </div>
          ))}
        </TagContainer>
      </Main>
      <Footer>
        <p>You can always change it later</p>
        <ButtonContainer>
          <Button onClick={() => redirect(getLinkToNextPage())}>
            Continue <ArrowForwardRoundedIcon />
          </Button>
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
