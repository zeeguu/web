import { useContext } from "react";
import SideNav from "./SideNav/SideNav";
import BottomNav from "./BottomNav/BottomNav";
import { MOBILE_WIDTH } from "./screenSize";
import { ThemeProvider } from "styled-components";
import { mainNavTheme } from "./mainNavTheme";
import { MainNavContext } from "../../contexts/MainNavContext";

export default function MainNav({ screenWidth, setUser }) {
  const { mainNavProperties } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNavProperties;

  return (
    // More about ThemeProviders (https://styled-components.com/docs/advanced)
    <ThemeProvider
      theme={isOnStudentSide ? mainNavTheme.student : mainNavTheme.teacher}
    >
      {screenWidth <= MOBILE_WIDTH ? (
        <BottomNav setUser={setUser} />
      ) : (
        <SideNav setUser={setUser} screenWidth={screenWidth} />
      )}
    </ThemeProvider>
  );
}
