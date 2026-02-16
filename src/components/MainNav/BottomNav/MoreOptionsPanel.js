import { useContext, useState, useMemo } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { MainNavContext } from "../../../contexts/MainNavContext";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NavigationOptions from "../navigationOptions";
import FeedbackButton from "../../FeedbackButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import LanguageModal from "../LanguageModal";
import navLanguages from "../navLanguages";
import * as s from "./MoreOptionsPanel.sc";

export default function MoreOptionsPanel({
  overlayTransition,
  moreOptionsTransition,
  handleHideMoreOptions,
  currentPath,
  renderMoreOptions,
}) {
  const { userDetails } = useContext(UserContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const { mainNavProperties } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNavProperties;
  const path = useLocation().pathname;

  const currentLearnedLanguage = useMemo(() => {
    const languageCode = userDetails.learned_language;
    const languageName = navLanguages[languageCode];
    return languageName || "Language";
  }, [userDetails.learned_language]);

  return (
    <s.MoreOptionsWrapper
      $renderMoreOptions={renderMoreOptions}
      $overlayTransition={overlayTransition}
      onClick={handleHideMoreOptions}
    >
      <s.MoreOptionsPanel
        aria-label="More Options Menu panel"
        $renderMoreOptions={renderMoreOptions}
        $moreOptionsTransition={moreOptionsTransition}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <s.CloseSection>
          <s.CloseButton
            aria-label="Close More Options panel"
            onClick={handleHideMoreOptions}
          >
            <CloseRoundedIcon fontSize="small" />
          </s.CloseButton>
        </s.CloseSection>

        <s.MoreOptionsList>
          {isOnStudentSide && (
            <>
              <NavOption
                {...NavigationOptions.myArticles}
                currentPath={currentPath}
                onClick={handleHideMoreOptions}
              />

              <NavOption
                {...NavigationOptions.myWords}
                currentPath={currentPath}
                onClick={handleHideMoreOptions}
              />

              <NavOption
                {...NavigationOptions.myActivity}
                currentPath={currentPath}
                onClick={handleHideMoreOptions}
              />

              {userDetails.is_teacher && (
                <NavOption
                  {...NavigationOptions.teacherSite}
                  currentPath={currentPath}
                  onClick={handleHideMoreOptions}
                />
              )}
            </>
          )}

          {!isOnStudentSide && (
            <NavOption
              {...NavigationOptions.studentSite}
              currentPath={currentPath}
              onClick={handleHideMoreOptions}
            />
          )}

          {isOnStudentSide && (
            <NavOption
              icon={<NavIcon name="language" />}
              text={currentLearnedLanguage}
              ariaLabel={`Change language (currently: ${currentLearnedLanguage})`}
              onClick={() => setShowLanguageModal(true)}
            />
          )}

          <NavOption
            {...NavigationOptions.settings}
            currentPath={path}
            onClick={handleHideMoreOptions}
          />

          <FeedbackButton />
        </s.MoreOptionsList>
      </s.MoreOptionsPanel>

      <LanguageModal
        prefixMsg={"MoreOptions"}
        open={showLanguageModal}
        setOpen={() => setShowLanguageModal(!showLanguageModal)}
      />
    </s.MoreOptionsWrapper>
  );
}
