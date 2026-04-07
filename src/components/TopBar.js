import { useCallback, useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import LanguageModal from "./MainNav/LanguageModal";
import LanguageStreakBar from "./LanguageStreakBar";
import * as s from "./Banners.sc";

export default function TopBar() {
  const { userDetails } = useContext(UserContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [hasStreakBar, setHasStreakBar] = useState(null);

  const closeLanguageModal = useCallback(() => setShowLanguageModal(false), []);
  const openLanguageModal = useCallback(() => setShowLanguageModal(true), []);

  return (
    <>
      <s.TopBarContainer>
        {hasStreakBar === false && (
          <s.FlagButton onClick={openLanguageModal} aria-label="Change language">
            <s.FlagImage src={`/static/flags-new/${userDetails?.learned_language}.svg`} alt="" />
          </s.FlagButton>
        )}
        <LanguageStreakBar
          onMultipleLanguages={setHasStreakBar}
          onOpenModal={openLanguageModal}
        />
      </s.TopBarContainer>
      <LanguageModal
        open={showLanguageModal}
        setOpen={closeLanguageModal}
      />
    </>
  );
}
