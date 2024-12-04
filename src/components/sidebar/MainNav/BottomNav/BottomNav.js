import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import NavIcon from "../NavIcon";
import FeedbackButton from "../../../FeedbackButton";
import NavOption from "../NavOption";
import NotificationIcon from "../../../NotificationIcon";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [shouldMOreOptionsRender, setShouldMOreOptionsRender] = useState(false);
  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();
  const [isBottonNavVisible, setIsBottomNavVisible] = useState(true);
  const [shouldBottomNavRender, setShouldBottomNavRender] = useState(false);

  useEffect(() => {
    if (path.includes("/exercises") || path.includes("/read")) {
      setIsBottomNavVisible(false);
      setTimeout(() => setShouldBottomNavRender(false), 500);
    } else {
      setIsBottomNavVisible(true);
      setShouldBottomNavRender(true);
    }
  }, [path]);

  function handleShowMoreOptions() {
    setIsMoreOptionsVisible(true);
    setIsOverlayVisible(true);
    setShouldMOreOptionsRender(true);
  }

  function handleHideMoreOptions() {
    setIsMoreOptionsVisible(false);
    setIsOverlayVisible(false);
    setTimeout(() => setShouldMOreOptionsRender(false), 500);
  }

  return (
    <>
      {shouldBottomNavRender && (
        <>
          {shouldMOreOptionsRender && (
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
                      currentPath={path}
                      onClick={handleHideMoreOptions}
                    />

                    <NavOption
                      isOnStudentSide={isOnStudentSide}
                      linkTo={"/history"}
                      icon={<NavIcon name="history" />}
                      text={"History"}
                      currentPath={path}
                      onClick={handleHideMoreOptions}
                    />

                    {isTeacher && (
                      <NavOption
                        linkTo={"/teacher/classes"}
                        icon={<NavIcon name="teacherSite" />}
                        text={"Teacher Site"}
                        currentPath={path}
                        onClick={handleHideMoreOptions}
                      />
                    )}
                  </>
                )}

                {!isOnStudentSide && (
                  <>
                    <NavOption
                      isOnStudentSide={isOnStudentSide}
                      linkTo={"/articles"}
                      icon={<NavIcon name="studentSite" />}
                      text={"Student Site"}
                      currentPath={path}
                      onClick={handleHideMoreOptions}
                    />
                  </>
                )}

                <FeedbackButton isOnStudentSide={isOnStudentSide} />
              </s.MoreOptionsPanel>
            </s.MoreOptionsWrapper>
          )}
          <s.BottomNav
            isBottonNavVisible={isBottonNavVisible}
            isOnStudentSide={isOnStudentSide}
          >
            {isOnStudentSide && (
              <>
                <s.BottomNavOption>
                  <s.StyledLink to="/articles">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/articles")}
                    >
                      <NavIcon name="home" />
                    </s.IconSpan>
                    Home
                  </s.StyledLink>
                </s.BottomNavOption>

                <s.BottomNavOption>
                  <s.StyledLink to="/exercises">
                    {hasExerciseNotification && (
                      <NotificationIcon
                        position={"top-absolute"}
                        text={notificationMsg}
                      />
                    )}
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/exercises")}
                    >
                      <NavIcon name="exercises" />
                    </s.IconSpan>
                    Exercises
                  </s.StyledLink>
                </s.BottomNavOption>

                <s.BottomNavOption>
                  <s.StyledLink to="/words">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/words")}
                    >
                      <NavIcon name="words" />
                    </s.IconSpan>
                    Words
                  </s.StyledLink>
                </s.BottomNavOption>
              </>
            )}

            {!isOnStudentSide && (
              <>
                <s.BottomNavOption>
                  <s.StyledLink to="/teacher/classes">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/teacher/classes")}
                    >
                      <NavIcon name="myClassrooms" />
                    </s.IconSpan>
                    My Classrooms
                  </s.StyledLink>
                </s.BottomNavOption>

                <s.BottomNavOption>
                  <s.StyledLink to="/teacher/texts">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/teacher/texts")}
                    >
                      <NavIcon name="myTexts" />
                    </s.IconSpan>
                    My Texts
                  </s.StyledLink>
                </s.BottomNavOption>
              </>
            )}

            <s.BottomNavOption>
              <s.StyledLink to="/account_settings">
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/account_settings")}
                >
                  <NavIcon name="settings" />
                </s.IconSpan>
                Settings
              </s.StyledLink>
            </s.BottomNavOption>

            <s.BottomNavOption>
              <s.StyledButton onClick={handleShowMoreOptions}>
                <s.IconSpan isOnStudentSide={isOnStudentSide}>
                  <NavIcon name="more" />
                </s.IconSpan>
                More
              </s.StyledButton>
            </s.BottomNavOption>
          </s.BottomNav>
        </>
      )}
    </>
  );
}
