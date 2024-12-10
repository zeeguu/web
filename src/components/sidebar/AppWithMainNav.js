import * as s from "./AppWithMainNav.sc";
import MainNav from "./MainNav/MainNav";
import useScreenWidth from "../../hooks/useScreenWidth";

export default function AppWithMainNav(props) {
  const { children: appContent } = props;
  const { screenWidth } = useScreenWidth();

  return (
    <s.AppWithMainNav>
      <MainNav screenWidth={screenWidth} />
      <s.AppContent $screenWidth={screenWidth} id="scrollHolder">
        {appContent}
      </s.AppContent>
    </s.AppWithMainNav>
  );
}
