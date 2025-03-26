import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import TopNav from "../components/TopNav";
import TopNavLink from "../components/TopNavLink";
import Logo from "../pages/_pages_shared/Logo";

export default function LandingPageTopNav() {
  function clearLearnedLanguage() {
    LocalStorage.setLearnedLanguage("");
  }
  return (
    <TopNav>
      <TopNavLink logo to="/">
        <Logo size={"1.9rem"} />
        Zeeguu
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
