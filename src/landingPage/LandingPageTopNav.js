import useScreenWidth from "../hooks/useScreenWidth";
import {
  isDesktopScreenWidth,
  isMediumScreenWidth,
} from "../components/MainNav/screenSize";
import strings from "../i18n/definitions";
import TopNav from "../components/TopNav/TopNav";
import TopNavOption from "../components/TopNav/TopNavOption";
import Logo from "../pages/_pages_shared/Logo";
import { getStoredSession } from "../utils/cookies/userInfo";

export default function LandingPageTopNav() {
  const { screenWidth } = useScreenWidth();
  const isLoggedIn = !!getStoredSession();

  return (
    <TopNav>
      <TopNavOption ariaLabel="Zeeguu" logo to="/">
        <Logo size={"1.7rem"} />
        {(isDesktopScreenWidth(screenWidth) ||
          isMediumScreenWidth(screenWidth)) &&
          "Zeeguu"}
      </TopNavOption>
      {isLoggedIn ? (
        <TopNavOption callToAction to="/articles">
          Back to Zeeguu
        </TopNavOption>
      ) : (
        <>
          <TopNavOption to="/log_in">{strings.login}</TopNavOption>
          <TopNavOption callToAction to="/invite_code">
            {strings.register}
          </TopNavOption>
        </>
      )}
    </TopNav>
  );
}
