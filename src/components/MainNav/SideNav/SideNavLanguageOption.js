import { useState, useContext, useMemo } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { APIContext } from "../../../contexts/APIContext";
import LanguageModal from "../LanguageModal";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import navLanguages from "../navLanguages";
import { CEFR_LEVELS } from "../../../assorted/cefrLevels";
import LocalStorage from "../../../assorted/LocalStorage";
import { saveSharedUserInfo } from "../../../utils/cookies/userInfo";
import styled from "styled-components";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const LanguageName = styled.span`
  cursor: pointer;
`;

const LevelBadge = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 0.3em;
  font-size: 0.75em;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export default function SideNavLanguageOption({ screenWidth }) {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [levelMenuAnchor, setLevelMenuAnchor] = useState(null);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const api = useContext(APIContext);

  const currentLearnedLanguage = useMemo(() => {
    const languageCode = userDetails.learned_language;
    const languageName = navLanguages[languageCode];
    return languageName || "Language";
  }, [userDetails.learned_language]);

  const currentCefrLevel = useMemo(() => {
    const languageCode = userDetails.learned_language;
    const cefrKey = languageCode + "_cefr_level";
    const cefrLevel = userDetails[cefrKey];
    const level = CEFR_LEVELS.find(level => level.value === cefrLevel?.toString());
    return level ? level.label.split(' | ')[0] : 'A1';
  }, [userDetails.learned_language, userDetails]);

  const handleLanguageNameClick = (e) => {
    e.stopPropagation();
    setShowLanguageModal(!showLanguageModal);
  };

  const handleLevelBadgeClick = (e) => {
    e.stopPropagation();
    setLevelMenuAnchor(e.currentTarget);
  };

  const handleLevelMenuClose = () => {
    setLevelMenuAnchor(null);
  };

  const handleCefrLevelChange = (newLevel) => {
    const languageCode = userDetails.learned_language;
    const cefrKey = languageCode + "_cefr_level";

    const newUserDetails = {
      ...userDetails,
      [cefrKey]: parseInt(newLevel),
    };

    const newUserDetailsForAPI = {
      ...newUserDetails,
      cefr_level: parseInt(newLevel),
    };

    api.saveUserDetails(newUserDetailsForAPI, () => {}, () => {
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      saveSharedUserInfo(newUserDetails);
      window.location.reload();
    });

    handleLevelMenuClose();
  };

  const languageDisplayed = currentLearnedLanguage || "Language not set";
  return (
    <>
      <NavOption
        ariaHasPopup={"dialog"}
        ariaLabel={`Change language (currently: ${languageDisplayed} ${currentCefrLevel})`}
        icon={<NavIcon name={"language"} />}
        text={
          <LanguageContainer>
            <LanguageName onClick={handleLanguageNameClick}>
              {languageDisplayed}
            </LanguageName>
            <LevelBadge onClick={handleLevelBadgeClick}>{currentCefrLevel}</LevelBadge>
          </LanguageContainer>
        }
        title={`${languageDisplayed} (${currentCefrLevel}) - Click name to change language, click level to change it`}
        screenWidth={screenWidth}
        onClick={() => setShowLanguageModal(true)} // Opens modal when clicking icon (especially important at medium widths where only icon is visible)
      />
      <LanguageModal
        prefixMsg={"Sidebar"}
        open={showLanguageModal}
        setOpen={() => {
          setShowLanguageModal(!showLanguageModal);
        }}
      ></LanguageModal>
      <Menu
        anchorEl={levelMenuAnchor}
        open={Boolean(levelMenuAnchor)}
        onClose={handleLevelMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {CEFR_LEVELS.map((level) => (
          <MenuItem
            key={level.value}
            selected={level.label.split(' | ')[0] === currentCefrLevel}
            onClick={() => handleCefrLevelChange(level.value)}
          >
            {level.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
