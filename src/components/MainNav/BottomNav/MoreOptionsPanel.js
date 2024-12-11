import * as s from "./MoreOptionsPanel.sc";
import FeedbackButton from "../../FeedbackButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavOption from "../NavOption";
import NavigationOptions from "../navigationOptions";

export default function MoreOptionsPanel({
  isOnStudentSide,
  isTeacher,
  overlayTransition,
  moreOptionsTransition,
  handleHideMoreOptions,
  currentPath,
}) {
  return (
    <s.MoreOptionsWrapper
      $overlayTransition={overlayTransition}
      onClick={handleHideMoreOptions}
    >
      <s.MoreOptionsPanel
        $moreOptionsTransition={moreOptionsTransition}
        $isOnStudentSide={isOnStudentSide}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <s.CloseSection>
          <s.CloseButton onClick={handleHideMoreOptions}>
            <CloseRoundedIcon fontSize="small" />
          </s.CloseButton>
        </s.CloseSection>

        {isOnStudentSide && (
          <>
            <NavOption
              {...NavigationOptions.statistics}
              currentPath={currentPath}
              onClick={handleHideMoreOptions}
            />

            <NavOption
              {...NavigationOptions.history}
              currentPath={currentPath}
              onClick={handleHideMoreOptions}
            />

            {isTeacher && (
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

        <FeedbackButton isOnStudentSide={isOnStudentSide} />
      </s.MoreOptionsPanel>
    </s.MoreOptionsWrapper>
  );
}
