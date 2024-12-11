import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import NavIcon from "../NavIcon";
import MoreOptions from "./MoreOptions";
import BottomNav_Student from "./BottomNav_Student";
import BottomNav_Teacher from "./BottomNav_Teacher";
import BottomNavOption from "./BottomNavOption";
import strings from "../../../i18n/definitions";
import { fadeIn, fadeOut } from "../../transitions";
import { slideIn, slideOut } from "../../transitions";

export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;

  const [overlayTransition, setOverlayTransition] = useState();
  const [renderMoreOptions, setRenderMoreOptions] = useState(false);
  const [moreOptionsTransition, setMoreOptionsTransition] = useState();
  const [bottomNavTransition, setBottomNavTransition] = useState();
  const [renderBottomNav, setRenderBottomNav] = useState(false);

  useEffect(() => {
    if (path.includes("/exercises") || path.includes("/read")) {
      setBottomNavTransition(slideOut);
      setTimeout(() => setRenderBottomNav(false), 500);
    } else {
      setBottomNavTransition(slideIn);
      setRenderBottomNav(true);
    }
  }, [path]);

  function handleShowMoreOptions() {
    setOverlayTransition(fadeIn);
    setRenderMoreOptions(true);
    setMoreOptionsTransition(slideIn);
  }

  function handleHideMoreOptions() {
    setOverlayTransition(fadeOut);
    setMoreOptionsTransition(slideOut);
    setTimeout(() => setRenderMoreOptions(false), 500);
  }

  return (
    <>
      {renderBottomNav && (
        <>
          <s.BottomNav
            $bottomNavTransition={bottomNavTransition}
            $isOnStudentSide={isOnStudentSide}
          >
            {isOnStudentSide && (
              <BottomNav_Student isOnStudentSide={isOnStudentSide} />
            )}

            {!isOnStudentSide && (
              <BottomNav_Teacher isOnStudentSide={isOnStudentSide} />
            )}
            <BottomNavOption
              linkTo={"/account_settings"}
              currentPath={path}
              icon={<NavIcon name="settings" />}
              text={strings.settings}
              isOnStudentSide={isOnStudentSide}
            />

            <BottomNavOption
              onClick={handleShowMoreOptions}
              icon={<NavIcon name="more" />}
              text={strings.more}
              isOnStudentSide={isOnStudentSide}
            />
          </s.BottomNav>
        </>
      )}

      {renderMoreOptions && (
        <MoreOptions
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
          overlayTransition={overlayTransition}
          moreOptionsTransition={moreOptionsTransition}
          handleHideMoreOptions={handleHideMoreOptions}
        />
      )}
    </>
  );
}
