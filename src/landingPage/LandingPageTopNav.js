import LocalStorage from "../assorted/LocalStorage";
import useScreenWidth from "../hooks/useScreenWidth";
import {
  isDesktopScreenWidth,
  isMediumScreenWidth,
} from "../components/MainNav/screenSize";
import strings from "../i18n/definitions";
import TopNav from "../components/TopNav/TopNav";
import TopNavOption from "../components/TopNav/TopNavOption";
import Logo from "../pages/_pages_shared/Logo";

export default function LandingPageTopNav() {
  const { screenWidth } = useScreenWidth();
  function clearLearnedLanguage() {
    LocalStorage.setLearnedLanguage("");
  }
  return (
    <TopNav>
      <TopNavOption ariaLabel="Zeeguu" logo to="/">
        <Logo size={"1.7rem"} />
        {(isDesktopScreenWidth(screenWidth) ||
          isMediumScreenWidth(screenWidth)) &&
          "Zeeguu"}
      </TopNavOption>
      <TopNavOption to="/log_in">{strings.login}</TopNavOption>
      <TopNavOption
        callToAction
        onClick={clearLearnedLanguage}
        to="/language_preferences"
      >
        {strings.register}
      </TopNavOption>
    </TopNav>
  );
}
