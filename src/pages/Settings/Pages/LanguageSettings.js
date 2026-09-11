import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { SystemLanguagesContext } from "../../../contexts/SystemLanguagesContext";
import { APIContext } from "../../../contexts/APIContext";
import { UserContext } from "../../../contexts/UserContext";
import { saveSharedUserInfo } from "../../../utils/cookies/userInfo";
import { cefrLevelFieldValue } from "../../../utils/misc/userCefrLevel";
import { varietyFieldValue, dialectFieldValue } from "../../../utils/misc/languageVariety";
import strings from "../../../i18n/definitions";
import LocalStorage from "../../../assorted/LocalStorage";
import LoadingAnimation from "../../../components/LoadingAnimation";
import LanguageChoiceFields from "../../../components/LanguageChoiceFields";
import LanguageCountryFields from "../../../components/LanguageCountryFields";
import Button from "../../_pages_shared/Button.sc";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import Form from "../../_pages_shared/Form.sc";
import FormSection from "../../_pages_shared/FormSection.sc";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";
import useLanguageChoiceFields from "../../../hooks/useLanguageChoiceFields";
import { scrollToTop } from "../../../utils/misc/scrollToTop";

export default function LanguageSettings() {
  const api = useContext(APIContext);
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);
  const { userDetails, setUserDetails, session } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");

  const languageChoice = useLanguageChoiceFields({
    cefrLevelForLanguage: (languageCode) => cefrLevelFieldValue(userDetails, languageCode),
    varietyForLanguage: (languageCode) => varietyFieldValue(userDetails, languageCode),
    dialectForLanguage: (languageCode) => dialectFieldValue(userDetails, languageCode),
  });

  const history = useHistory();
  const isPageMounted = useRef(true);

  useEffect(() => {
    setTitle(strings.languageSettings);
  }, []);

  useEffect(() => {
    isPageMounted.current = true;

    if (isPageMounted.current) {
      // Seeds the level and the variety too, from what is stored for that same
      // language.
      languageChoice.setLearnedLanguage(userDetails.learned_language);
      languageChoice.setTranslationLanguage(userDetails.native_language);
    }

    return () => {
      isPageMounted.current = false;
    };
    // eslint-disable-next-line
  }, [session, api]);

  function handleSave(e) {
    e.preventDefault();
    if (!languageChoice.validate()) {
      scrollToTop();
      return;
    }

    const learnedLanguage = languageChoice.learnedLanguage;
    const cefrLevel = parseInt(languageChoice.cefrLevel);

    const newUserDetails = {
      ...userDetails,
      learned_language: learnedLanguage,
      native_language: languageChoice.translationLanguage,
      [learnedLanguage + "_cefr_level"]: cefrLevel,
      [learnedLanguage + "_feed_variety"]: languageChoice.variety || null,
      [learnedLanguage + "_dialect"]: languageChoice.dialect || null,
    };

    const newUserDetailsForAPI = {
      ...newUserDetails,
      cefr_level: cefrLevel,
      // Always sent, including empty: that is how a learner goes back to no
      // preference. The endpoint only leaves a variety alone when the key is
      // absent altogether.
      feed_variety: languageChoice.variety,
      dialect: languageChoice.dialect,
    };

    api.saveUserDetails(newUserDetailsForAPI, setErrorMessage, () => {
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      // Part of the feed cache key: without this the next feed request would be
      // answered from the previous variety's cached response.
      LocalStorage.setLearnedVariety(languageChoice.variety);
      saveSharedUserInfo(newUserDetails);
      history.goBack();
    });
  }

  if (!userDetails || !sortedSystemLanguages) {
    return <LoadingAnimation />;
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title={strings.languageSettings} />
      <Main>
        <Form>
          {errorMessage && (
            <FormSection>
              <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
            </FormSection>
          )}

          <LanguageChoiceFields fields={languageChoice} />

          <FormSection>
            <LanguageCountryFields fields={languageChoice} />
          </FormSection>

          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </CardPage>
  );
}
