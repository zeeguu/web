import { useState, useMemo, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import LanguageModal from "../LanguageModal";
import BottomNavOption from "./BottomNavOption";
import NavIcon from "../NavIcon";
import navLanguages from "../navLanguages";

export default function BottomNavLanguageOption({ setUser }) {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const user = useContext(UserContext);

  const currentLearnedLanguage = useMemo(() => {
    const languageCode = user.learned_language;
    const languageName = navLanguages[languageCode];
    return languageName || "Language";
  }, [user.learned_language]);

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
        setUser={setUser}
        prefixMsg={"Sidebar"}
        open={showLanguageModal}
        setOpen={() => {
          setShowLanguageModal(!showLanguageModal);
        }}
      ></LanguageModal>
    </>
  );
}
