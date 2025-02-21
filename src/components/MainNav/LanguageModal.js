import { useState, useEffect, useContext } from "react";
import { APIContext } from "../../contexts/APIContext.js";
import { UserContext } from "../../contexts/UserContext.js";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo.js";
import LocalStorage from "../../assorted/LocalStorage.js";
import Modal from "../modal_shared/Modal.js";
import Form from "../../pages/_pages_shared/Form.sc.js";
import ButtonContainer from "../modal_shared/ButtonContainer.sc.js";
import Button from "../../pages/_pages_shared/Button.sc.js";
import FormSection from "../../pages/_pages_shared/FormSection.sc.js";
import Main from "../modal_shared/Main.sc.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import RadioGroup from "./RadioGroup.js";
import ReactLink from "../ReactLink.sc.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function LanguageModal({ open, setOpen, setUser }) {
  const api = useContext(APIContext);
  const user = useContext(UserContext);
  const [, setErrorMessage] = useState("");
  const [userDetails, setUserDetails] = useState(undefined);
  const [currentLearnedLanguage, setCurrentLearnedLanguage] =
    useState(undefined);
  const [activeLanguages, setActiveLanguages] = useState(undefined);
  const [CEFR, setCEFR] = useState("");

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
    if (open) {
      api.getUserDetails((data) => {
        setUserDetails(data);
        setCEFRlevel(data); //the api won't update without CEFR (bug to fix)
        setCurrentLearnedLanguage(data.learned_language);
      });

      api.getUserLanguages((data) => {
        setActiveLanguages(data);
      });
    }
    return () => {
      setActiveLanguages(undefined);
      setUserDetails(undefined);
      setCurrentLearnedLanguage(undefined);
    };
  }, [open, api, user.session]);

  const reorderedLanguages = activeLanguages?.sort((a, b) => {
    if (a.code === user.learned_language) return -1;
    if (b.code === user.learned_language) return 1;
    return 0;
  });

  function updateLearnedLanguage(lang_code) {
    setCurrentLearnedLanguage(lang_code);
    const newUserDetails = {
      ...userDetails,
      learned_language: lang_code,
      cefr_level: CEFR,
    };
    setUserDetails(newUserDetails);
  }

  function updateUserInfo(info) {
    LocalStorage.setUserInfo(info);
    setUser({
      ...user,
      learned_language: info.learned_language,
      cefr_level: CEFR,
    });

    saveUserInfoIntoCookies(info);
  }

  function handleSave(e) {
    e.preventDefault();
    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails);
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
              radioGroupLabel="Select the language you want to practice:"
              name="active-language"
              options={reorderedLanguages}
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
            <ReactLink
              className="small"
              onClick={() => setOpen(false)}
              to="/account_settings/language_settings"
            >
              <AddRoundedIcon /> Add a new language
            </ReactLink>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
