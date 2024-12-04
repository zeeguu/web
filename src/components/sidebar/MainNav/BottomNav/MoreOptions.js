import React from "react";
import * as s from "./MoreOptions.sc";
import FeedbackButton from "../../../FeedbackButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

export default function MoreOptions({
  isOnStudentSide,
  isTeacher,
  isOverlayVisible,
  isMoreOptionsVisible,
  handleHideMoreOptions,
  currentPath,
}) {
  return (
    <s.MoreOptionsWrapper
      isOverlayVisible={isOverlayVisible}
      onClick={handleHideMoreOptions}
    >
      <s.MoreOptionsPanel
        isMoreOptionsVisible={isMoreOptionsVisible}
        isOnStudentSide={isOnStudentSide}
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
              isOnStudentSide={isOnStudentSide}
              linkTo={"/user_dashboard"}
              icon={<NavIcon name="statistics" />}
              text={"Statistics"}
              currentPath={currentPath}
              onClick={handleHideMoreOptions}
            />

            <NavOption
              isOnStudentSide={isOnStudentSide}
              linkTo={"/history"}
              icon={<NavIcon name="history" />}
              text={"History"}
              currentPath={currentPath}
              onClick={handleHideMoreOptions}
            />

            {isTeacher && (
              <NavOption
                linkTo={"/teacher/classes"}
                icon={<NavIcon name="teacherSite" />}
                text={"Teacher Site"}
                currentPath={currentPath}
                onClick={handleHideMoreOptions}
              />
            )}
          </>
        )}

        {!isOnStudentSide && (
          <NavOption
            isOnStudentSide={isOnStudentSide}
            linkTo={"/articles"}
            icon={<NavIcon name="studentSite" />}
            text={"Student Site"}
            currentPath={currentPath}
            onClick={handleHideMoreOptions}
          />
        )}

        <FeedbackButton isOnStudentSide={isOnStudentSide} />
      </s.MoreOptionsPanel>
    </s.MoreOptionsWrapper>
  );
}
