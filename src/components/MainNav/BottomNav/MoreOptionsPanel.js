import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { MainNavContext } from "../../../contexts/MainNavContext";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NavigationOptions from "../navigationOptions";
import FeedbackButton from "../../FeedbackButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavOption from "../NavOption";
import * as s from "./MoreOptionsPanel.sc";

export default function MoreOptionsPanel({
  overlayTransition,
  moreOptionsTransition,
  handleHideMoreOptions,
  currentPath,
  renderMoreOptions,
}) {
  const { is_teacher: isTeacher } = useContext(UserContext);
  const { mainNavProperties } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNavProperties;
  const path = useLocation().pathname;

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

          <NavOption
            {...NavigationOptions.settings}
            currentPath={path}
            onClick={handleHideMoreOptions}
          />

          <FeedbackButton />
        </s.MoreOptionsList>
      </s.MoreOptionsPanel>
    </s.MoreOptionsWrapper>
  );
}
