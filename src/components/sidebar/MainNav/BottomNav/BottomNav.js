import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import NavIcon from "../NavIcon";
import MoreOptions from "./MoreOptions";
import BottomNav_Student from "./BottomNav_Student";
import BottomNav_Teacher from "./BottomNav_Teacher";

export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [shouldMoreOptionsRender, setShouldMoreOptionsRender] = useState(false);
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
          <s.BottomNav
            isBottonNavVisible={isBottonNavVisible}
            isOnStudentSide={isOnStudentSide}
          >
            {isOnStudentSide && (
              <BottomNav_Student isOnStudentSide={isOnStudentSide} />
            )}

            {!isOnStudentSide && (
              <BottomNav_Teacher isOnStudentSide={isOnStudentSide} />
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
    </>
  );
}
