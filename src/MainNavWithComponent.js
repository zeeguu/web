import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { MainNavContext } from "./contexts/MainNavContext";
import { UserContext } from "./contexts/UserContext";
import useScreenWidth from "./hooks/useScreenWidth";
import MainNav from "./components/MainNav/MainNav";
import * as s from "./MainNavWithComponent.sc";

export default function MainNavWithComponent(props) {
  const { children: appContent, setUser } = props;
  const { screenWidth } = useScreenWidth();
  const userContext = useContext(UserContext);

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
        <MainNav setUser={setUser} screenWidth={screenWidth} />
        <s.AppContent
          // Update the key when the learned_language changes to trigger a re-render
          // of the app content that needs real-time updates. This is a smoother
          // alternative to window.location.reload() when switching the practiced language in navigation.
          key={userContext.userData.userDetails.learned_language}
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
