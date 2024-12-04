import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import NavIcon from "../NavIcon";
import NotificationIcon from "../../../NotificationIcon";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import MoreOptions from "./MoreOptions";

export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [shouldMoreOptionsRender, setShouldMoreOptionsRender] = useState(false);
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
    setShouldMoreOptionsRender(true);
  }

  function handleHideMoreOptions() {
    setIsMoreOptionsVisible(false);
    setIsOverlayVisible(false);
    setTimeout(() => setShouldMoreOptionsRender(false), 500);
  }

  return (
    <>
      {shouldBottomNavRender && (
        <>
          {shouldMoreOptionsRender && (
            <MoreOptions
              currentPath={path}
              isOnStudentSide={isOnStudentSide}
              isTeacher={isTeacher}
              isOverlayVisible={isOverlayVisible}
              isMoreOptionsVisible={isMoreOptionsVisible}
              handleHideMoreOptions={handleHideMoreOptions}
            />
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
