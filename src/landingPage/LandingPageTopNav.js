import LocalStorage from "../assorted/LocalStorage";
import useScreenWidth from "../hooks/useScreenWidth";
import {
  isDesktopScreenWidth,
  isMediumScreenWidth,
} from "../components/MainNav/screenSize";
import strings from "../i18n/definitions";
import TopNav from "../components/TopNav";
import TopNavLink from "../components/TopNavLink";
import Logo from "../pages/_pages_shared/Logo";

export default function LandingPageTopNav() {
  const { screenWidth } = useScreenWidth();
  function clearLearnedLanguage() {
    LocalStorage.setLearnedLanguage("");
  }
  return (
    <TopNav>
      <TopNavLink ariaLabel="Zeeguu" logo to="/">
        <Logo size={"1.7rem"} />
        {(isDesktopScreenWidth(screenWidth) ||
          isMediumScreenWidth(screenWidth)) &&
          "Zeeguu"}
      </TopNavLink>
      <TopNavLink to="/log_in">{strings.login}</TopNavLink>
      <TopNavLink
        callToAction
        onClick={clearLearnedLanguage}
        to="/language_preferences"
      >
        {strings.register}
      </TopNavLink>
    </TopNav>
  );
}
