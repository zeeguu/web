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
import BackArrow from "./settings_pages_shared/BackArrow";
import Selector from "../../components/Selector";

export default function Languages({ api, setUser }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [languages, setLanguages] = useState();
  // TODO: not used; see if you can remove
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
    console.log("language code in updateLearnedLanguage");
    console.log(lang_code);
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

  console.log(userDetails);

  return (
    <InfoPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.languageSettings}</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            {errorMessage && (
              <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
            )}
            <LanguageSelector
              id={"practiced-language-selector"}
              label={strings.learnedLanguage}
              languages={languages.learnable_languages}
              selected={userDetails.learned_language}
              onChange={(languageCode) => {
                updateLearnedLanguage(languageCode);
              }}
            />

            <Selector
              id={"cefr-levels-selector"}
              options={CEFR_LEVELS}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              onChange={(e) => {
                updateCEFRLevel(e.target.value);
              }}
              selectedValue={userDetails.cefr_level}
            />
          </FormSection>

          <FormSection>
            <LanguageSelector
              id={"translation-language-selector"}
              label={strings.baseLanguage}
              languages={languages.native_languages}
              selected={userDetails.native_language}
              onChange={(languageCode) => {
                updateNativeLanguage(languageCode);
              }}
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button onClick={handleSave}>{strings.save}</Button>
          </ButtonContainer>
        </Form>
      </Main>
    </InfoPage>
  );
}
