import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import Sidebar from "./SideBar/Sidebar";
import BottomNav from "./BottomNav/BottomNav";
import { MOBILE_WIDTH } from "./screenSize";
import { ThemeProvider } from "styled-components";
import { mainNavTheme } from "./mainNavTheme";
import { MainNavContext } from "../../contexts/MainNavContext";

export default function MainNav({ screenWidth }) {
  const { isOnStudentSide, setIsOnStudentSide } = useContext(MainNavContext);
  const path = useLocation().pathname;
  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  return (
    <ThemeProvider
      theme={isOnStudentSide ? mainNavTheme.student : mainNavTheme.teacher}
    >
      {screenWidth <= MOBILE_WIDTH ? (
        <BottomNav />
      ) : (
        <Sidebar screenWidth={screenWidth} />
      )}
    </ThemeProvider>
  );
}
