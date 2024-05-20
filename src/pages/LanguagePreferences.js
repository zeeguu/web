import { useState, useEffect, useContext } from "react";

import { UserContext } from "../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../utils/cookies/userInfo";

import redirect from "../utils/routing/routing";
import useFormField from "../hooks/useFormField";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import FullWidthErrorMsg from "./info_page_shared/FullWidthErrorMsg";
import FormSection from "./info_page_shared/FormSection";
import SelectOptions from "./info_page_shared/SelectOptions";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import validator from "../assorted/validator";
import strings from "../i18n/definitions";
import LoadingAnimation from "../components/LoadingAnimation";

import { CEFR_LEVELS } from "../assorted/cefrLevels";

export default function LanguagePreferences({ api, setUser }) {
  const user = useContext(UserContext);
  const [learned_language, handleLearned_language_change] = useFormField("");
  const [native_language, handleNative_language_change] = useFormField("en");
  const [learned_cefr_level, handleLearned_cefr_level_change] =
    useFormField("");
  const [systemLanguages, setSystemLanguages] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    api.getSystemLanguages((languages) => {
      languages.learnable_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      languages.native_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      setSystemLanguages(languages);
    });
    // eslint-disable-next-line
  }, []);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }

  let validatorRules = [
    [learned_language === "", "Please select language you want to practice"],
    [
      learned_cefr_level === "",
      "Please select your current level in language you want to practice",
    ],
    [
      native_language === "",
      "Please select language you want to translations in",
    ],
  ];

  let userInfo = {
    ...user,
    learned_language: learned_language,
    learned_cefr_level: learned_cefr_level,
    native_language: native_language,
  };

  const modifyCEFRlevel = (languageID, cefrLevel) => {
    api.modifyCEFRlevel(languageID, cefrLevel);
  };

  function updateUser(e) {
    e.preventDefault();

    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }

    api.saveUserDetails(userInfo, setErrorMessage, () => {
      modifyCEFRlevel(learned_language, learned_cefr_level);
      setUser(userInfo);
      saveUserInfoIntoCookies(userInfo);
      redirect("/select_interests");
    });
  }

  return (
    <InfoPage type={"narrow"}>
      <Header>
        <Heading>
          What language would&nbsp;you&nbsp;like&nbsp;to&nbsp;learn?
        </Heading>
      </Header>
      <Main>
        <Form action={""}>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <SelectOptions
              value={learned_language}
              label={strings.learnedLanguage}
              placeholder={strings.learnedLanguagePlaceholder}
              optionLabel={(e) => e.name}
              optionValue={(e) => e.code}
              id={"practiced-languages"}
              options={systemLanguages.learnable_languages}
              onChangeHandler={handleLearned_language_change}
            />

            <SelectOptions
              value={learned_cefr_level}
              label={strings.levelOfLearnedLanguage}
              placeholder={strings.levelOfLearnedLanguagePlaceholder}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              id={"level-of-practiced-languages"}
              options={CEFR_LEVELS}
              onChangeHandler={handleLearned_cefr_level_change}
            />

            <SelectOptions
              value={native_language}
              label={strings.baseLanguage}
              placeholder={strings.baseLanguagePlaceholder}
              optionLabel={(e) => e.name}
              optionValue={(e) => e.code}
              id={"translation-languages"}
              options={systemLanguages.native_languages}
              onChangeHandler={handleNative_language_change}
            />
          </FormSection>
          <p>{strings.youCanChangeLater}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button className={"full-width-btn"} onClick={updateUser}>
              {strings.next} <ArrowForwardRoundedIcon />
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </InfoPage>
  );
}
