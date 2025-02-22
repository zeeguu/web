import * as s from "./MainNavWithComponent.sc";
import MainNav from "./components/MainNav/MainNav";
import useScreenWidth from "./hooks/useScreenWidth";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { MainNavContext } from "./contexts/MainNavContext";
import { useEffect, useState } from "react";

export default function MainNavWithComponent(props) {
  const { children: appContent } = props;
  const { screenWidth } = useScreenWidth();

  const path = useLocation().pathname;

  //Initial state and setter passed to the value prop of the MainNavContext.Provider
  const [mainNavProperties, setMainNavProperties] = useState({
    isOnStudentSide: true,
  });

  useEffect(() => {
    setMainNavProperties({
      ...mainNavProperties,
      isOnStudentSide: !path.includes("teacher"),
    });
    // eslint-disable-next-line
  }, [path]);

  return (
    <MainNavContext.Provider
      value={{
        mainNavProperties: mainNavProperties,
        setMainNavProperties: setMainNavProperties,
      }}
    >
      <s.MainNavWithComponent $screenWidth={screenWidth}>
        <MainNav screenWidth={screenWidth} />
        <s.AppContent
          $currentPath={path}
          $screenWidth={screenWidth}
          id="scrollHolder"
        >
          {appContent}
        </s.AppContent>
      </s.MainNavWithComponent>
    </MainNavContext.Provider>
  );
}
