import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import Sidebar from "./SideBar/Sidebar";
import BottomNav from "./BottomNav/BottomNav";
import { MOBILE_WIDTH } from "./screenSize";
import { ThemeProvider as MainNavThemeProvider } from "styled-components";
import { mainNavTheme } from "./mainNavTheme";

export default function MainNav({ screenWidth }) {
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);

  const path = useLocation().pathname;

  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  return (
    <MainNavThemeProvider
      theme={isOnStudentSide ? mainNavTheme.student : mainNavTheme.teacher}
    >
      {screenWidth <= MOBILE_WIDTH ? (
        <BottomNav isOnStudentSide={isOnStudentSide} />
      ) : (
        <Sidebar screenWidth={screenWidth} isOnStudentSide={isOnStudentSide} />
      )}
    </MainNavThemeProvider>
  );
}
