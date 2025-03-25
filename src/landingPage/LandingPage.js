import { useEffect, useState, useContext } from "react";
import { APIContext } from "../contexts/APIContext.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import strings from "../i18n/definitions";
import News from "./News";
import * as s from "./LandingPage.sc.js";
import Contributors from "./Contributors";
import { Redirect } from "react-router-dom";
import { setTitle } from "../assorted/setTitle";
import { getSessionFromCookies } from "../utils/cookies/userInfo";
import Button from "../pages/_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import LocalStorage from "../assorted/LocalStorage.js";
import Logo from "../pages/_pages_shared/Logo.js";

export default function LandingPage() {
  const api = useContext(APIContext);
  const history = useHistory();
  const [systemLanguages, setSystemLanguages] = useState();

  useEffect(() => {
    setTitle(strings.landingPageTitle);

    api.getSystemLanguages((languages) => {
      languages.learnable_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      languages.native_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      setSystemLanguages(languages);
    });
  }, [api]);

  if (getSessionFromCookies()) {
    return <Redirect to={{ pathname: "/articles" }} />;
  }

  function handleLanguageSelect(language) {
    LocalStorage.setLearnedLanguage(language);
    history.push("/language_preferences");
  }

  function handleRegisterClick() {
    LocalStorage.setLearnedLanguage("");
    history.push("/language_preferences");
  }

  function handleLogInClick() {
    history.push("/log_in");
  }

  return (
    <s.PageWrapper>
      <s.NavbarBg>
        <s.Navbar>
          <s.LogoWithText>
            <Logo size={"1.9rem"} />
            Zeeguu
          </s.LogoWithText>
          <s.NavbarButtonContainer>
            <s.WhiteOutlinedNavbarBtn onClick={() => handleLogInClick()}>
              {strings.login}
            </s.WhiteOutlinedNavbarBtn>
            <s.WhiteFilledNavbarBtn onClick={() => handleRegisterClick()}>
              {strings.register}
            </s.WhiteFilledNavbarBtn>
          </s.NavbarButtonContainer>
        </s.Navbar>
      </s.NavbarBg>

      <s.PageContent>
        <s.HeroColumn>
          <s.HeroLeftColumn>
            <h1>
              Read what you love in your target language and improve your
              vocabulary
            </h1>
            <p className="hero-paragraph">
              {/* {strings.projectDescription_UltraShort} */}
              Find interesting articles, translate words as you read, and use
              spaced repetition to remember them
            </p>
            <Button onClick={() => handleRegisterClick()}>
              {strings.getStarted}
              <RoundedForwardArrow />
            </Button>
          </s.HeroLeftColumn>
          <s.HeroRightColumn>
            {systemLanguages &&
              systemLanguages.learnable_languages.map((language) => (
                <Button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  {language.name}
                </Button>
              ))}
          </s.HeroRightColumn>
        </s.HeroColumn>

        <s.PaleAdaptableColumn>
          <h1>{strings.howDoesItWork}</h1>
          <h2>{strings.personalizedReading}</h2>
          <s.DescriptionText>
            <p>{strings.personalizedRecommandationsEllaboration1}</p>

            <p>{strings.personalizedRecommandationsEllaboration2}</p>
          </s.DescriptionText>

          <h2>{strings.easyTranslations}</h2>
          <s.DescriptionText>
            <p>{strings.easyTranslationsEllaboration1}</p>

            <p>{strings.easyTranslationsEllaboration2}</p>

            <p>{strings.easyTranslationsEllaboration3}</p>
          </s.DescriptionText>

          <h2>{strings.personalizedExercises}</h2>
          <s.DescriptionText>
            <p>{strings.personalizedPractiseEllaboration1}</p>

            <p>{strings.personalizedMultipleExerciseTypes}</p>

            <p>{strings.personalizedPractiseEllaboration2}</p>
          </s.DescriptionText>
        </s.PaleAdaptableColumn>

        <s.AdaptableColumn>
          <News />
        </s.AdaptableColumn>

        <s.PaleAdaptableColumn>
          <Contributors />
        </s.PaleAdaptableColumn>
      </s.PageContent>
    </s.PageWrapper>
  );
}
