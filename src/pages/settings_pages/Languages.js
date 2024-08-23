import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import { CEFR_LEVELS } from "../../assorted/cefrLevels";
import strings from "../../i18n/definitions";
import LocalStorage from "../../assorted/LocalStorage";
import LoadingAnimation from "../../components/LoadingAnimation";
import LanguageSelector from "../../components/LanguageSelector";
import Button from "../info_page_shared/Button";
import ButtonContainer from "../info_page_shared/ButtonContainer";
import Form from "../info_page_shared/Form";
import FormSection from "../info_page_shared/FormSection";
import InfoPage from "../info_page_shared/InfoPage";
import Header from "../info_page_shared/Header";
import Heading from "../info_page_shared/Heading";
import Main from "../info_page_shared/Main";
import FullWidthErrorMsg from "../info_page_shared/FullWidthErrorMsg";

import BackArrow from "../settings_pages_shared/BackArrow";

import KeyValueSelector from "../../components/KeyValueSelector";

export default function Languages({ api, setUser }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [languages, setLanguages] = useState();
  const [cefr, setCEFR] = useState("");

  const user = useContext(UserContext);
  const history = useHistory();

  function setCEFRlevel(data) {
    const levelKey = data.learned_language + "_cefr_level";
    const levelNumber = data[levelKey];
    setCEFR("" + levelNumber);
    setUserDetails({
      ...data,
      cefr_level: levelNumber,
    });
  }

  useEffect(() => {
    api.getUserDetails((data) => {
      setUserDetails(data);
      setCEFRlevel(data);
    });

    api.getSystemLanguages((systemLanguages) => {
      setLanguages(systemLanguages);
    });
  }, [user.session, api]);

  function updateUserInfo(info) {
    LocalStorage.setUserInfo(info);
    setUser({
      ...user,
      name: info.name,
      learned_language: info.learned_language,
      native_language: info.native_language,
    });

    saveUserInfoIntoCookies(info);
  }

  function getLanguageCodeFromSelector(e) {
    return e.target[e.target.selectedIndex].getAttribute("code");
  }

  function updateNativeLanguage(lang_code) {
    setUserDetails({
      ...userDetails,
      native_language: lang_code,
    });
  }

  function updateCEFRLevel(level) {
    setUserDetails({
      ...userDetails,
      cefr_level: level,
    });
  }

  function updateLearnedLanguage(lang_code) {
    setUserDetails({
      ...userDetails,
      learned_language: lang_code,
    });
  }

  function handleSave(e) {
    e.preventDefault();
    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails);
      history.goBack();
    });
  }

  if (!userDetails || !languages) {
    return <LoadingAnimation />;
  }

  return (
    <InfoPage pageLocation={"settings"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.languages}</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            {errorMessage && (
              <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
            )}
            <LanguageSelector
              label={strings.learnedLanguage}
              languages={languages.learnable_languages}
              selected={language_for_id(
                userDetails.learned_language,
                languages.learnable_languages,
              )}
              onChange={(e) => {
                updateLearnedLanguage(getLanguageCodeFromSelector(e));
              }}
            />

            <KeyValueSelector
              elements={CEFR_LEVELS}
              optionLabel={(e) => e.label}
              val={(e) => e.value}
              updateFunction={(e) => {
                updateCEFRLevel(e);
              }}
              current={userDetails.cefr_level}
            />
          </FormSection>

          <FormSection>
            <LanguageSelector
              label={strings.baseLanguage}
              languages={languages.native_languages}
              selected={language_for_id(
                userDetails.native_language,
                languages.native_languages,
              )}
              onChange={(e) => {
                updateNativeLanguage(getLanguageCodeFromSelector(e));
              }}
            />
          </FormSection>
          <ButtonContainer>
            <Button onClick={handleSave}>{strings.save}</Button>
          </ButtonContainer>
        </Form>
      </Main>
    </InfoPage>
  );
}

function language_for_id(id, language_list) {
  for (let i = 0; i < language_list.length; i++) {
    console.log(language_list[i].code, id);
    if (language_list[i].code === id) {
      return language_list[i].name;
    }
  }
}
