import * as s from "./MoreOptionsPanel.sc";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import FeedbackButton from "../../FeedbackButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavOption from "../NavOption";
import NavigationOptions from "../navigationOptions";
import { MainNavContext } from "../../../contexts/MainNavContext";

export default function MoreOptionsPanel({
  overlayTransition,
  moreOptionsTransition,
  handleHideMoreOptions,
  currentPath,
  renderMoreOptions,
}) {
  const { is_teacher: isTeacher } = useContext(UserContext);
  const { mainNav } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNav;

  return (
    <s.MoreOptionsWrapper
      $renderMoreOptions={renderMoreOptions}
      $overlayTransition={overlayTransition}
      onClick={handleHideMoreOptions}
    >
      <s.MoreOptionsPanel
        $renderMoreOptions={renderMoreOptions}
        $moreOptionsTransition={moreOptionsTransition}
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

        <FeedbackButton />
      </s.MoreOptionsPanel>
    </s.MoreOptionsWrapper>
  );
}
