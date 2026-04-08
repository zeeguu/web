import { useContext, useEffect, useMemo, useState } from "react";
import { APIContext } from "../../contexts/APIContext.js";
import { UserContext } from "../../contexts/UserContext.js";
import useGuardedLanguageSwitch from "../../hooks/useGuardedLanguageSwitch.js";
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
import CircularProgress from "@mui/material/CircularProgress";
import DynamicFlagImage from "../DynamicFlagImage.js";
import LanguageOptionLabel from "./LanguageOptionLabel.js";
import LocalStorage from "../../assorted/LocalStorage.js";
import { saveSharedUserInfo } from "../../utils/cookies/userInfo.js";

const MAX_MODAL_LANGUAGES = 7;
const spinnerSx = { color: "var(--streak-banner-text)" };

export default function LanguageModal({ open, setOpen }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails, session } = useContext(UserContext);
  const { requestSwitch, confirmModal, willConfirm } = useGuardedLanguageSwitch();
  const [, setErrorMessage] = useState("");

  const [learnedLanguageCode, setLearnedLanguageCode] = useState(null);
  const [activeLanguages, setActiveLanguages] = useState(null);
  const [streaksByCode, setStreaksByCode] = useState({});
  const [practicedByCode, setPracticedByCode] = useState({});
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    setLearnedLanguageCode(userDetails.learned_language);

    api.getUserLanguages((data) => {
      if (!cancelled) setActiveLanguages(data);
    });

    api.getAllLanguageStreaks((data) => {
      if (cancelled) return;
      const streakMap = {};
      const practicedMap = {};
      data.forEach((l) => {
        streakMap[l.code] = l.daily_streak;
        practicedMap[l.code] = l.practiced_today;
      });
      setStreaksByCode(streakMap);
      setPracticedByCode(practicedMap);
    });

    return () => {
      cancelled = true;
      setActiveLanguages(null);
      setLearnedLanguageCode(null);
    };
  }, [open, api, session]);

  const getCefrLevelValueForLanguage = (languageCode) => {
    const cefrKey = languageCode + "_cefr_level";
    const cefrLevel = userDetails[cefrKey];
    return cefrLevel?.toString() || "1";
  };

  const handleCefrLevelChange = (languageCode, newLevel, e) => {
    e.stopPropagation();
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
      return (streaksByCode[b.code] || 0) - (streaksByCode[a.code] || 0);
    });
  }, [activeLanguages, userDetails.native_language, userDetails.learned_language, streaksByCode]);

  function updateLearnedLanguage(lang_code) {
    setLearnedLanguageCode(lang_code);
    // Skip the in-modal "switching" spinner when a confirmation will be shown
    // on top — otherwise the underlying modal hides its content while the user
    // is still deciding whether to switch.
    if (!willConfirm) setIsSwitching(true);
    requestSwitch(lang_code, () => {
      setIsSwitching(false);
      setOpen(false);
    });
  }

  return (
    <>
    {confirmModal}
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Header withoutLogo>
        <Heading>{isSwitching ? "Changing language..." : "Your Active Languages:"}</Heading>
      </Header>
      <Main>
        <Form>
          {isSwitching ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 0", gap: "1rem" }}>
              <DynamicFlagImage languageCode={learnedLanguageCode} />
              <CircularProgress size={24} sx={spinnerSx} />
            </div>
          ) : (
            <>
              <FormSection>
                <RadioGroup
                  radioGroupLabel=""
                  name="active-language"
                  options={reorderedLanguages.slice(0, MAX_MODAL_LANGUAGES)}
                  selectedValue={learnedLanguageCode}
                  onChange={(e) => {
                    updateLearnedLanguage(e.target.value);
                  }}
                  optionLabel={(e) => (
                    <LanguageOptionLabel
                      languageName={e.language}
                      streak={streaksByCode[e.code] || 0}
                      practiced={practicedByCode[e.code]}
                      cefrLevelValue={getCefrLevelValueForLanguage(e.code)}
                      onCefrLevelChange={(newLevel, ev) => handleCefrLevelChange(e.code, newLevel, ev)}
                    />
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
            </>
          )}
        </Form>
      </Main>
    </Modal>
    </>
  );
}
