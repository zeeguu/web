import { useState, useMemo, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import LanguageModal from "../LanguageModal";
import BottomNavOption from "./BottomNavOption";
import NavIcon from "../NavIcon";
import navLanguages from "../navLanguages";

export default function BottomNavLanguageOption() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { userData } = useContext(UserContext);
  const { userDetails } = userData;

  const currentLearnedLanguage = useMemo(() => {
    const languageCode = userDetails.learned_language;
    const languageName = navLanguages[languageCode];
    return languageName || "Language";
  }, [userDetails.learned_language]);

  const languageDisplayed = currentLearnedLanguage || "Language";
  return (
    <>
      <BottomNavOption
        ariaHasPopup={"dialog"}
        ariaLabel={`Change language (currently: ${languageDisplayed})`}
        icon={<NavIcon name="language" />}
        text={languageDisplayed}
        onClick={(e) => {
          e.stopPropagation();
          setShowLanguageModal(!showLanguageModal);
        }}
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
