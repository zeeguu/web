import { useState, useEffect, useContext } from "react";
import { APIContext } from "../../contexts/APIContext.js";
import { UserContext } from "../../contexts/UserContext.js";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo.js";
import LocalStorage from "../../assorted/LocalStorage.js";
import Modal from "../modal_shared/Modal.js";
import Form from "../../pages/_pages_shared/Form.sc.js";
import ButtonContainer from "../modal_shared/ButtonContainer.sc.js";
import Button from "../../pages/_pages_shared/Button.sc.js";
import { Link } from "react-router-dom";
import FormSection from "../../pages/_pages_shared/FormSection.sc.js";
import Main from "../modal_shared/Main.sc.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import RadioGroup from "./RadioGroup.js";

export default function LanguageModal({ open, setOpen, setUser }) {
  const api = useContext(APIContext);
  const user = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [userDetails, setUserDetails] = useState(undefined);
  const [currentLearnedLanguage, setCurrentLearnedLanguage] =
    useState(undefined);
  const [activeLanguages, setActiveLanguages] = useState(undefined);

  useEffect(() => {
    if (open) {
      api.getUserLanguages((data) => {
        setActiveLanguages(data);
      });

      api.getUserDetails((data) => {
        setUserDetails(data);
        setCurrentLearnedLanguage(data.learned_language);
      });
    }
    return () => {
      setActiveLanguages(undefined);
      setUserDetails(undefined);
      setCurrentLearnedLanguage(undefined);
    };
  }, [open, api, user.session, user.learned_language]);

  console.log("User details underneath useeffect:", userDetails);
  console.log("user context underneath useeffect:", user);

  //Note to myself: This one is working
  function updateLearnedLanguage(lang_code) {
    setCurrentLearnedLanguage(lang_code);
    const newUserDetails = { ...userDetails, learned_language: lang_code };
    setUserDetails(newUserDetails);
  }

  function handleSave(e) {
    e.preventDefault();
    api.saveUserDetails(userDetails, setErrorMessage, () => {
      LocalStorage.setUserInfo(userDetails);
      setUser({
        ...user,
        learned_language: userDetails.learned_language,
      });

      saveUserInfoIntoCookies(userDetails);
      setOpen(false);
    });
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Header withoutLogo>
        <Heading>Your Active Languages:</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            <RadioGroup
              radioGroupLabel="Choose your current language:"
              name="active-language"
              options={activeLanguages}
              selectedValue={currentLearnedLanguage}
              onChange={(e) => {
                updateLearnedLanguage(e.target.value);
              }}
              optionLabel={(e) => e.language}
              optionValue={(e) => e.code}
              optionId={(e) => e.id}
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button onClick={handleSave} type={"submit"}>
              Save
            </Button>
            <Link
              onClick={() => setOpen(false)}
              to="/account_settings/language_settings"
            >
              Add a new language
            </Link>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
