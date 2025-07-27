import { useState, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import LanguageModal from "../LanguageModal";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import navLanguages from "../navLanguages";
import { CEFR_LEVELS } from "../../../assorted/cefrLevels";
import styled from "styled-components";

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
  const { userDetails } = useContext(UserContext);
  const history = useHistory();

  const currentLearnedLanguage = useMemo(() => {
    const languageCode = userDetails.learned_language;
    const languageName = navLanguages[languageCode];
    return languageName || "Language";
  }, [userDetails.learned_language]);

  const currentCefrLevel = useMemo(() => {
    const languageCode = userDetails.learned_language;
    const cefrKey = languageCode + "_cefr_level";
    const cefrLevel = userDetails[cefrKey];
    const level = CEFR_LEVELS.find(level => level.value === cefrLevel.toString());
    return level ? level.label.split(' | ')[0] : 'A1'; // Extract just "A1", "B2", etc.
  }, [userDetails.learned_language, userDetails]);

  const handleLanguageNameClick = (e) => {
    e.stopPropagation();
    setShowLanguageModal(!showLanguageModal);
  };

  const handleLevelBadgeClick = (e) => {
    e.stopPropagation();
    history.push('/account_settings/language_settings');
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
        title={`${languageDisplayed} (${currentCefrLevel}) - Click name to change language, click level to go to settings`}
        screenWidth={screenWidth}
        onClick={() => {}} // Disable default click behavior since we handle clicks on individual elements
      />
      <LanguageModal
        prefixMsg={"Sidebar"}
        open={showLanguageModal}
        setOpen={() => {
          setShowLanguageModal(!showLanguageModal);
        }}
      ></LanguageModal>
    </>
  );
}
