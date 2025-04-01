import { useEffect, useState, useContext } from "react";
import { APIContext } from "../contexts/APIContext.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Redirect } from "react-router-dom";
import { setTitle } from "../assorted/setTitle";
import { getSessionFromCookies } from "../utils/cookies/userInfo";
import strings from "../i18n/definitions";
import News from "./News";
import Contributors from "./Contributors";
import Button from "../pages/_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import LocalStorage from "../assorted/LocalStorage.js";
import LandingPageTopNav from "./LandingPageTopNav.js";
import DynamicFlagImage from "../components/DynamicFlagImage.js";
import * as s from "./LandingPage.sc.js";

export default function LandingPage() {
  const api = useContext(APIContext);
  const history = useHistory();
  const [systemLanguages, setSystemLanguages] = useState();

  useEffect(() => {
    setTitle(strings.landingPageTitle);

    api.getSystemLanguages((languages) => {
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

  return (
    <s.PageWrapper>
      <s.Header>
        <LandingPageTopNav />
      </s.Header>
      <s.Main>
        <s.HeroSection>
          <s.HeroLeftColumn>
            <h1>
              Read what you love in your target language and improve
              your&nbsp;vocabulary
            </h1>
            <p className="hero-paragraph">
              Find interesting articles, translate words as&nbsp;you read,
              and&nbsp;use&nbsp;spaced repetition to&nbsp;remember&nbsp;them.
            </p>
            <Button onClick={() => handleRegisterClick()}>
              Start Learning
              <RoundedForwardArrow />
            </Button>
          </s.HeroLeftColumn>
          <s.LanguageGrid>
            {systemLanguages &&
              systemLanguages.learnable_languages.map((language) => (
                <Button
                  className="small grey left-aligned"
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <DynamicFlagImage languageCode={language.code} />
                  {language.name}
                </Button>
              ))}
          </s.LanguageGrid>
        </s.HeroSection>

        <s.PaleAdaptableColumn>
          <h1>{strings.howDoesItWork}</h1>
          <p>
            Zeeguu is a research project that personalizes the way you
            <br /> learn foreign languages
          </p>
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
      </s.Main>
    </s.PageWrapper>
  );
}
