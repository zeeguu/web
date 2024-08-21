import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import { CEFR_LEVELS } from "../../assorted/cefrLevels";
import strings from "../../i18n/definitions";
import LocalStorage from "../../assorted/LocalStorage";
import LoadingAnimation from "../../components/LoadingAnimation";
import UiLanguageSelector from "../../components/UiLanguageSelector";
import Button from "../info_page_shared/Button";
import ButtonContainer from "../info_page_shared/ButtonContainer";
import Form from "../info_page_shared/Form";
import FormSection from "../info_page_shared/FormSection";

import Select from "../../components/Select";
import { PageTitle } from "../../components/PageTitle";

export default function Languages({ api, setUser }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [languages, setLanguages] = useState();
  const [cefr, setCEFR] = useState("");

  const user = useContext(UserContext);

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
      // if (history.length > 1) {
      //   history.goBack();
      // } else {
      //   window.close();
      // }
    });
  }

  if (!userDetails || !languages) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>{" "}
      <PageTitle>{strings.languages}</PageTitle>
      <Form>
        <FormSection>
          <h5>{errorMessage}</h5>
          <label>{strings.learnedLanguage}</label>
          <UiLanguageSelector
            languages={languages.learnable_languages}
            selected={language_for_id(
              userDetails.learned_language,
              languages.learnable_languages,
            )}
            onChange={(e) => {
              updateLearnedLanguage(getLanguageCodeFromSelector(e));
            }}
          />

          <Select
            elements={CEFR_LEVELS}
            label={(e) => e.label}
            val={(e) => e.value}
            updateFunction={(e) => {
              updateCEFRLevel(e);
            }}
            current={cefr}
          />
        </FormSection>

        <FormSection>
          <label>{strings.nativeLanguage}</label>
          <UiLanguageSelector
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
    </div>
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
