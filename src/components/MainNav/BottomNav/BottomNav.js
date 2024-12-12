import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState, useRef } from "react";
import NavIcon from "../NavIcon";
import MoreOptionsPanel from "./MoreOptionsPanel";
import BottomNavOptionsForStudent from "./BottomNavOptionsForStudent";
import BottomNavOptionsForTeacher from "./BottomNavOptionsForTeacher";
import BottomNavOption from "./BottomNavOption";
import strings from "../../../i18n/definitions";
import { fadeIn, fadeOut } from "../../transitions";
import { slideIn, slideOut } from "../../transitions";

const PAGES_WITHOUT_BOTTOM_NAV = ["/exercises", "/read"];
export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;

  const [overlayTransition, setOverlayTransition] = useState({});
  const [renderMoreOptions, setRenderMoreOptions] = useState(false);
  const [moreOptionsTransition, setMoreOptionsTransition] = useState({});
  const [bottomNavTransition, setBottomNavTransition] = useState({});
  const [renderBottomNav, setRenderBottomNav] = useState(false);

  const delay = useRef(0); // initialize with an int that will represent the timeout id

  useEffect(() => {
    if (PAGES_WITHOUT_BOTTOM_NAV.some((page) => path.startsWith(page))) {
      setBottomNavTransition(slideOut);
      delay.current = setTimeout(() => setRenderBottomNav(false), 200);
    } else {
      setBottomNavTransition(slideIn);
      setRenderBottomNav(true);
    }
    return () => {
      clearTimeout(delay.current);
    };
  }, [path]);

  function handleShowMoreOptions() {
    setOverlayTransition(fadeIn);
    setRenderMoreOptions(true);
    setMoreOptionsTransition(slideIn);
  }

  function handleHideMoreOptions() {
    clearTimeout(delay.current);
    setOverlayTransition(fadeOut);
    setMoreOptionsTransition(slideOut);
    delay.current = setTimeout(() => setRenderMoreOptions(false), 200);
  }

  return (
    <>
      {renderBottomNav && (
        <>
          <s.BottomNav
            $bottomNavTransition={bottomNavTransition}
            $isOnStudentSide={isOnStudentSide}
          >
            {isOnStudentSide && <BottomNavOptionsForStudent />}

            {!isOnStudentSide && <BottomNavOptionsForTeacher />}

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
        <MoreOptionsPanel
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
