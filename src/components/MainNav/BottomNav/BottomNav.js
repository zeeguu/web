import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { MainNavContext } from "../../../contexts/MainNavContext";
import { PAGES_WITHOUT_BOTTOM_NAV } from "./pagesWithoutBottomNav";
import BottomNavOptionsForStudent from "./BottomNavOptionsForStudent";
import BottomNavOptionsForTeacher from "./BottomNavOptionsForTeacher";
import { slideIn, slideOut } from "../../transitions";
import strings from "../../../i18n/definitions";
import NavIcon from "../NavIcon";
import BottomNavOption from "./BottomNavOption";
import MoreOptionsPanel from "./MoreOptionsPanel";
import useMoreOptionsPanel from "../useMoreOptionsPanel";
import * as s from "./BottomNav.sc";

export default function BottomNav() {
  const { mainNavProperties } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNavProperties;

  const path = useLocation().pathname;

  const moreOptions = useMoreOptionsPanel();
  const [bottomNavTransition, setBottomNavTransition] = useState({});
  const [renderBottomNav, setRenderBottomNav] = useState(false);

  const navbarDelay = useRef(0);

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

  // The actions -- Read, Exercises, Listen, Translate -- and then More, which
  // holds the places to look things up: My Words, My Activity and the rest.
  return (
    <>
      {renderBottomNav && (
        <s.BottomNav
          aria-label="Bottom Navigation"
          $bottomNavTransition={bottomNavTransition}
        >
          <s.NavList>
            {isOnStudentSide && <BottomNavOptionsForStudent />}

            {!isOnStudentSide && <BottomNavOptionsForTeacher />}

            <BottomNavOption
              onClick={moreOptions.showMoreOptions}
              icon={<NavIcon name="more" />}
              text={strings.more}
              ariaHasPopup={"true"}
            />
          </s.NavList>
        </s.BottomNav>
      )}

      {moreOptions.renderMoreOptions && (
        <MoreOptionsPanel
          currentPath={path}
          overlayTransition={moreOptions.overlayTransition}
          moreOptionsTransition={moreOptions.moreOptionsTransition}
          handleHideMoreOptions={moreOptions.hideMoreOptions}
        />
      )}
    </>
  );
}
