import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { MainNavContext } from "../../../contexts/MainNavContext";
import NavigationOptions from "../navigationOptions";
import FeedbackButton from "../../FeedbackButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavOption from "../NavOption";
import * as s from "./MoreOptionsPanel.sc";
import AccountNavOption from "../AccountNavOption";
import Feature from "../../../features/Feature";
import { hasSupportedVerbalFlashcardsLearnedLanguage } from "../../../verbalFlashcards/verbalFlashcardsAvailability";

export default function MoreOptionsPanel({
  overlayTransition,
  moreOptionsTransition,
  handleHideMoreOptions,
  currentPath,
  renderMoreOptions,
}) {
  const { userDetails } = useContext(UserContext);

  const { mainNavProperties } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNavProperties;

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
          <s.CloseButton aria-label="Close More Options panel" onClick={handleHideMoreOptions}>
            <CloseRoundedIcon fontSize="small" />
          </s.CloseButton>
        </s.CloseSection>

        <s.MoreOptionsList>
          {isOnStudentSide && (
            <>
              <NavOption {...NavigationOptions.myActivity} currentPath={currentPath} onClick={handleHideMoreOptions} />

              {Feature.verbal_flashcards() && hasSupportedVerbalFlashcardsLearnedLanguage(userDetails) && (
                <NavOption
                  {...NavigationOptions.verbalFlashcards}
                  currentPath={currentPath}
                  onClick={handleHideMoreOptions}
                />
              )}

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
            <NavOption {...NavigationOptions.studentSite} currentPath={currentPath} onClick={handleHideMoreOptions} />
          )}

          <FeedbackButton />

          {/* The TopBar already shows the language flag and, with gamification,
              the avatar -- so the panel only repeats the account row when the
              TopBar has no avatar to reach the profile from. */}
          {!Feature.has_gamification() && <AccountNavOption onNavigate={handleHideMoreOptions} />}
        </s.MoreOptionsList>
      </s.MoreOptionsPanel>

    </s.MoreOptionsWrapper>
  );
}
