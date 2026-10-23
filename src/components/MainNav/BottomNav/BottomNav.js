import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { MainNavContext } from "../../../contexts/MainNavContext";
import { PAGES_WITHOUT_BOTTOM_NAV } from "./pagesWithoutBottomNav";
import BottomNavOptionsForStudent from "./BottomNavOptionsForStudent";
import BottomNavOptionsForTeacher from "./BottomNavOptionsForTeacher";
import { slideIn, slideOut } from "../../transitions";
import * as s from "./BottomNav.sc";

export default function BottomNav() {
  const { mainNavProperties } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNavProperties;

  const path = useLocation().pathname;

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

  // Actions only: Read, Exercises, Listen, Translate. More (My Words, My
  // Activity and the rest) opens from the TopBar.
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
          </s.NavList>
        </s.BottomNav>
      )}
    </>
  );
}
