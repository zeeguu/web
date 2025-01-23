import * as s from "./MainNavWithComponent.sc";
import MainNav from "./components/MainNav/MainNav";
import useScreenWidth from "./hooks/useScreenWidth";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

export default function MainNavWithComponent(props) {
  const { children: appContent } = props;
  const { screenWidth } = useScreenWidth();

  const path = useLocation().pathname;

  return (
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
  );
}
