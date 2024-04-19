import { useState, useRef, useEffect } from "react";
import Select from "../components/Select";

import redirect from "../utils/routing/routing";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import InputField from "./info_page_shared/InputField";
import SelectOptions from "./info_page_shared/SelectOptions";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import validator from "../assorted/validator";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import { CEFR_LEVELS } from "../assorted/cefrLevels";

import * as s from "../components/FormPage.sc";
import PrivacyNotice from "./PrivacyNotice";
import * as EmailValidator from "email-validator";

export default function LanguagePreferences({ api, setUser }) {
  const [learned_language, setLearned_language] = useState("");
  const [native_language, setNative_language] = useState("en");
  const [learned_cefr_level, setLearned_cefr_level] = useState("");

  const [systemLanguages, setSystemLanguages] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    api.getSystemLanguages((languages) => {
      languages.learnable_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      languages.native_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      setSystemLanguages(languages);
      // inviteCodeInputDOM.current.focus();
    });
    // eslint-disable-next-line
  }, []);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }
  return (
    <InfoPage type={"narrow"}>
      <Header>
        <Heading>What language would you like to learn?</Heading>
      </Header>
      <Main>
        <Form action={""}>
          <SelectOptions
            placeholder={"Select language"}
            label={(e) => e.name}
            val={(e) => e.code}
            id={"practiced-languages"}
            selectLabel={"I want to learn"}
            options={systemLanguages.learnable_languages}
            onChange={setLearned_language}
          />

          <SelectOptions
            placeholder={"Select level"}
            label={(e) => e.label}
            val={(e) => e.value}
            id={"level-of-practiced-languages"}
            selectLabel={"My current level"}
            options={CEFR_LEVELS}
            onChange={setLearned_cefr_level}
          />

          <SelectOptions
            placeholder={"Select language"}
            label={(e) => e.name}
            val={(e) => e.code}
            id={"translation-languages"}
            selectLabel={"I want translations in"}
            options={systemLanguages.native_languages}
            onChange={setNative_language}
            // current={"en"}
          />

          {/* <div className="inputField">
            <label>{strings.learnedLanguage}</label>

            <Select
              elements={systemLanguages.learnable_languages}
              label={(e) => e.name}
              val={(e) => e.code}
              updateFunction={setLearned_language}
            />
          </div>

          <div className="inputField">
            <label>{strings.levelOfLearnedLanguage}</label>

            <Select
              elements={CEFR_LEVELS}
              label={(e) => e.label}
              val={(e) => e.value}
              updateFunction={setLearned_cefr_level}
            />
          </div>

          <div className="inputField">
            <label>{strings.baseLanguage}</label>

            <Select
              elements={systemLanguages.native_languages}
              label={(e) => e.name}
              val={(e) => e.code}
              updateFunction={setNative_language}
              current={"en"}
            />
          </div> */}

          {/* <PrivacyNotice /> */}

          {errorMessage && <div className="error">{errorMessage}</div>}
          <p>You can always change it later</p>
          <ButtonContainer>
            <Button>
              Next <ArrowForwardRoundedIcon />
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer></Footer>
    </InfoPage>
  );
}
