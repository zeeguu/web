import { useContext, useEffect, useMemo, useState } from "react";
import { APIContext } from "../../contexts/APIContext.js";
import { UserContext } from "../../contexts/UserContext.js";
import { saveSharedUserInfo } from "../../utils/cookies/userInfo.js";
import LocalStorage from "../../assorted/LocalStorage.js";
import Modal from "../modal_shared/Modal.js";
import Form from "../../pages/_pages_shared/Form.sc.js";
import ButtonContainer from "../modal_shared/ButtonContainer.sc.js";
import FormSection from "../../pages/_pages_shared/FormSection.sc.js";
import Main from "../modal_shared/Main.sc.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import RadioGroup from "./RadioGroup.js";
import ReactLink from "../ReactLink.sc.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DynamicFlagImage from "../DynamicFlagImage.js";
import { CEFR_LEVELS } from "../../assorted/cefrLevels.js";
import styled from "styled-components";

const CefrSection = styled.span`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 0.75em;
  border-left: 1px solid rgba(128, 128, 128, 0.3);
  height: 1.5em;
`;

const CefrSelect = styled.select`
  font-size: 0.9em;
  font-weight: 600;
  padding: 0.2em 0.3em;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0.3em;
  }

  &:focus {
    outline: none;
  }
`;

export default function LanguageModal({ open, setOpen }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails, session } = useContext(UserContext);
  const [, setErrorMessage] = useState("");

  const [learnedLanguageCode, setLearnedLanguageCode] = useState(null);
  const [activeLanguages, setActiveLanguages] = useState(null);

  useEffect(() => {
    if (open) {
      setLearnedLanguageCode(userDetails.learned_language);

      api.getUserLanguages((data) => {
        setActiveLanguages(data);
      });
    }
    return () => {
      setActiveLanguages(undefined);
      setLearnedLanguageCode(undefined);
    };
  }, [open, api, session]);

  const getCefrLevelValueForLanguage = (languageCode) => {
    const cefrKey = languageCode + "_cefr_level";
    const cefrLevel = userDetails[cefrKey];
    return cefrLevel?.toString() || "1";
  };

  const handleCefrLevelChange = (languageCode, newLevel, e) => {
    e.stopPropagation(); // Prevent triggering radio button
    const cefrKey = languageCode + "_cefr_level";

    const newUserDetails = {
      ...userDetails,
      [cefrKey]: parseInt(newLevel),
    };

    const newUserDetailsForAPI = {
      ...newUserDetails,
      learned_language: languageCode,
      cefr_level: parseInt(newLevel),
    };

    api.saveUserDetails(newUserDetailsForAPI, setErrorMessage, () => {
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      saveSharedUserInfo(newUserDetails);
      // Reload if changing level for current language
      if (languageCode === userDetails.learned_language) {
        window.location.reload();
      }
    });
  };

  const reorderedLanguages = useMemo(() => {
    if (!activeLanguages) return [];

    const filteredLanguages = activeLanguages.filter((lang) => lang.code !== userDetails.native_language);

    return filteredLanguages.sort((a, b) => {
      if (a.code === userDetails.learned_language) return -1;
      if (b.code === userDetails.learned_language) return 1;
      return 0;
    });
  }, [activeLanguages, userDetails.native_language, userDetails.learned_language]);

  function updateLearnedLanguage(lang_code) {
    setLearnedLanguageCode(lang_code);

    // Automatically save the selection
    const newUserDetails = {
      ...userDetails,
      learned_language: lang_code,
    };

    api.saveUserDetails(newUserDetails, setErrorMessage, () => {
      // Re-fetch user details to get updated daily_audio_status for new language
      api.getUserDetails((freshUserDetails) => {
        setUserDetails(freshUserDetails);
        LocalStorage.setUserInfo(freshUserDetails);
        saveSharedUserInfo(freshUserDetails);
        setOpen(false); // Close modal after successful save
      });
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
              optionLabel={(e) => (
                <>
                  {e.language}
                  <CefrSection>
                    <CefrSelect
                      value={getCefrLevelValueForLanguage(e.code)}
                      onClick={(ev) => ev.stopPropagation()}
                      onChange={(ev) => handleCefrLevelChange(e.code, ev.target.value, ev)}
                    >
                      {CEFR_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label.split(" | ")[0]}
                        </option>
                      ))}
                    </CefrSelect>
                  </CefrSection>
                </>
              )}
              optionValue={(e) => e.code}
              optionId={(e) => e.id}
              dynamicIcon={(e) => <DynamicFlagImage languageCode={e.code} />}
              radiosContentLeftAligned
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <ReactLink className="small" onClick={() => setOpen(false)} to="/account_settings/language_settings">
              <AddRoundedIcon /> More language settings
            </ReactLink>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
