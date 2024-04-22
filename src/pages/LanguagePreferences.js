import { useState, useEffect, useContext } from "react";

import { UserContext } from "../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../utils/cookies/userInfo";

import redirect from "../utils/routing/routing";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import FormSection from "./info_page_shared/FormSection";
import SelectOptions from "./info_page_shared/SelectOptions";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import validator from "../assorted/validator";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import { CEFR_LEVELS } from "../assorted/cefrLevels";

export default function LanguagePreferences({ api, setUser }) {
  const user = useContext(UserContext);

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
    api.modifyCEFRlevel(
      languageID,
      cefrLevel,
      (res) => {
        console.log("Update '" + languageID + "' CEFR level to: " + cefrLevel);
        console.log("API returns update status: " + res);
      },
      () => {
        console.log("Connection to server failed...");
      },
    );
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
        <Heading>What language would you like to learn?</Heading>
      </Header>
      <Main>
        <Form action={""}>
          <FormSection>
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
              current={"en"}
            />
          </FormSection>

          {errorMessage && <div className="error">{errorMessage}</div>}
          <p>You can always change it later</p>
          <ButtonContainer>
            <Button onClick={updateUser}>
              Next <ArrowForwardRoundedIcon />
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </InfoPage>
  );
}
