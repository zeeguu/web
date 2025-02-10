import { useState, useContext, useMemo } from "react";
import { UserContext } from "../../../contexts/UserContext";
import LanguageModal from "../LanguageModal";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import navLanguages from "../navLanguages";

export default function SideNavLanguageOption() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const user = useContext(UserContext);

  const currentLearnedLanguage = useMemo(() => {
    const languageCode = user.learned_language;
    const languageName = navLanguages[languageCode];
    return languageName || "Language";
  }, [user.learned_language]);

  const languageDisplayed = currentLearnedLanguage || "Language not set";
  return (
    <>
      <NavOption
        ariaHasPopup={"dialog"}
        ariaLabel={`Change language (currently: ${languageDisplayed})`}
        icon={<NavIcon name={"language"} />}
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
