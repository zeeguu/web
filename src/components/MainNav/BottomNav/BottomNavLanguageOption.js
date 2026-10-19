import { useState, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import LanguageModal from "../LanguageModal";
import BottomNavOption from "./BottomNavOption";
import NavIcon from "../NavIcon";
import { knownLanguageName } from "../../../utils/misc/languageCodeToName";

export default function BottomNavLanguageOption() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { userDetails } = useContext(UserContext);

  // Not memoized on the language code: on a first launch the names arrive from
  // the API after this first renders, and the re-render must pick them up.
  const currentLearnedLanguage = knownLanguageName(userDetails.learned_language) || "Language";

  return (
    <>
      <BottomNavOption
        ariaHasPopup={"dialog"}
        ariaLabel={`Change language (currently: ${currentLearnedLanguage})`}
        icon={<NavIcon name="language" />}
        text={currentLearnedLanguage}
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
