import { useState, useEffect, useContext, useMemo } from "react";
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

export default function LanguageModal({ open, setOpen }) {
  const api = useContext(APIContext);
  const { userData, setUserData, session } = useContext(UserContext);
  const [, setErrorMessage] = useState("");

  const [learnedLanguageCode, setLearnedLanguageCode] = useState(null);
  const [activeLanguages, setActiveLanguages] = useState(null);

  useEffect(() => {
    if (open) {
      setLearnedLanguageCode(userData.userDetails.learned_language);

      api.getUserLanguages((data) => {
        setActiveLanguages(data);
      });
    }
    return () => {
      setActiveLanguages(undefined);

      setLearnedLanguageCode(undefined);
    };
  }, [open, api, session]);

  const reorderedLanguages = useMemo(() => {
    if (!activeLanguages) return [];

    // Filter out the user's translation language
    const filteredLanguages = activeLanguages.filter(
      (lang) => lang.code !== userData.native_language,
    );

    return filteredLanguages.sort((a, b) => {
      if (a.code === userData.userDetails.learned_language) return -1;
      if (b.code === userData.userDetails.learned_language) return 1;
      return 0;
    });
  }, [
    activeLanguages,
    userData.userDetails.native_language,
    userData.userDetails.learned_language,
  ]);

  function updateLearnedLanguage(lang_code) {
    setLearnedLanguageCode(lang_code);
  }

  function handleSave(e) {
    e.preventDefault();

    const newUserDetails = {
      ...userData.userDetails,
      learned_language: learnedLanguageCode,
    };

    api.saveUserDetails(newUserDetails, setErrorMessage, () => {
      setUserData({
        ...userData,
        userDetails: newUserDetails,
      });

      LocalStorage.setUserInfo(newUserDetails);
      saveUserInfoIntoCookies(newUserDetails);

      setOpen(false);
      console.log("success in updating userDetails");
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
              selectedValue={learnedLanguageCode}
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
