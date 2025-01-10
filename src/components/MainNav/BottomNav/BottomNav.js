import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import NavIcon from "../NavIcon";
import MoreOptionsPanel from "./MoreOptionsPanel";
import BottomNavOptionsForStudent from "./BottomNavOptionsForStudent";
import BottomNavOptionsForTeacher from "./BottomNavOptionsForTeacher";
import BottomNavOption from "./BottomNavOption";
import strings from "../../../i18n/definitions";
import { fadeIn, fadeOut } from "../../transitions";
import { slideIn, slideOut } from "../../transitions";
import { MainNavContext } from "../../../contexts/MainNavContext";
import { PAGES_WITHOUT_BOTTOM_NAV } from "./pagesWithoutBottomNav";

export default function BottomNav() {
  const { mainNav } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNav;

  const path = useLocation().pathname;

  const [overlayTransition, setOverlayTransition] = useState({});
  const [renderMoreOptions, setRenderMoreOptions] = useState(false);
  const [moreOptionsTransition, setMoreOptionsTransition] = useState({});
  const [bottomNavTransition, setBottomNavTransition] = useState({});
  const [renderBottomNav, setRenderBottomNav] = useState(false);

  const navbarDelay = useRef(0);
  const optionsPanelDelay = useRef(0);

  useEffect(() => {
    if (PAGES_WITHOUT_BOTTOM_NAV.some((page) => path.startsWith(page))) {
      setBottomNavTransition(slideOut);
      navbarDelay.current = setTimeout(() => setRenderBottomNav(false), 300);
    } else {
      setBottomNavTransition(slideIn);
      setRenderBottomNav(true);
    }
    return () => {
      clearTimeout(navbarDelay.current);
    };
  }, [path]);

  function handleShowMoreOptions() {
    clearTimeout(optionsPanelDelay.current);
    setOverlayTransition(fadeIn);
    setRenderMoreOptions(true);
    setMoreOptionsTransition(slideIn);
  }

  function handleHideMoreOptions() {
    clearTimeout(optionsPanelDelay.current);
    setOverlayTransition(fadeOut);
    setMoreOptionsTransition(slideOut);
    optionsPanelDelay.current = setTimeout(
      () => setRenderMoreOptions(false),
      300,
    );
  }

  return (
    <>
      {renderBottomNav && (
        <s.BottomNav $bottomNavTransition={bottomNavTransition}>
          {isOnStudentSide && <BottomNavOptionsForStudent />}

          {!isOnStudentSide && <BottomNavOptionsForTeacher />}

          <BottomNavOption
            linkTo={"/account_settings"}
            currentPath={path}
            icon={<NavIcon name="settings" />}
            text={strings.settings}
          />

          <BottomNavOption
            onClick={handleShowMoreOptions}
            icon={<NavIcon name="more" />}
            text={strings.more}
          />
        </s.BottomNav>
      )}

      {renderMoreOptions && (
        <MoreOptionsPanel
          currentPath={path}
          overlayTransition={overlayTransition}
          moreOptionsTransition={moreOptionsTransition}
          handleHideMoreOptions={handleHideMoreOptions}
        />
      )}
    </>
  );
}
