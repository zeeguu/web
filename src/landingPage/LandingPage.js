import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Redirect } from "react-router-dom";
import { setTitle } from "../assorted/setTitle";
import { getSessionFromCookies } from "../utils/cookies/userInfo";
import { SystemLanguagesContext } from "../contexts/SystemLanguagesContext.js";
import strings from "../i18n/definitions";
import News from "./News";
import Contributors from "./Contributors";
import Button from "../pages/_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import LandingPageTopNav from "./LandingPageTopNav.js";
import DynamicFlagImage from "../components/DynamicFlagImage.js";
import * as s from "./LandingPage.sc.js";

export default function LandingPage() {
  const history = useHistory();
  const { systemLanguages } = useContext(SystemLanguagesContext);

  useEffect(() => {
    setTitle(strings.landingPageTitle);
  }, []);

  if (getSessionFromCookies()) {
    return <Redirect to={{ pathname: "/articles" }} />;
  }

  function handleLanguageSelect(selectedLanguage) {
    history.push(`/language_preferences?selected_language=${selectedLanguage}`);
  }

  function handleRegisterClick() {
    history.push(`/language_preferences`);
  }

  return (
    <s.PageWrapper>
      <s.Header>
        <LandingPageTopNav />
      </s.Header>
      <s.Main>
        <s.HeroSection>
          <h1>
            Learn a language by reading what you love and improve
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
        <s.PageSectionWrapper>
          <s.PageSection>
            <h2>{strings.howDoesItWork}</h2>
            <p>
              Zeeguu is a research project that personalizes the way you learn
              foreign languages
            </p>

            <s.Subsection>
              <s.SubsectionText>
                {/* <h3>{strings.personalizedReading}</h3> */}
                <h3>Browse your personalized&nbsp;feed</h3>
                <p>
                  Our system continuously searches the internet to bring you new
                  article recommendations tailored to your interests and desired
                  language difficulty.
                </p>
                {/* <p>{strings.personalizedRecommandationsEllaboration1}</p>
                <p>{strings.personalizedRecommandationsEllaboration2}</p> */}
              </s.SubsectionText>
              <s.SubsectionImage src="static/images/feed.png" />
              {/* <img src="static/images/feed.png" /> */}
              {/* </s.SubsectionImage> */}
            </s.Subsection>

            <s.Subsection>
              <s.SubsectionImage src="static/images/feed.png" />
              {/* <img src="static/images/feed.png" /> */}
              {/* <img src="/" /> */}
              {/* </s.SubsectionImage> */}
              <s.SubsectionText>
                {/* <h3>{strings.easyTranslations}</h3> */}
                <h3>Read, translate words &&nbsp;hear&nbsp;pronunciation</h3>
                <p>
                  Select an article from your personalized feed, read it easily,
                  Right-click anywhere on the article’s page to enjoy
                  distraction-free reading with our browser extension. Instantly
                  translate words and hear their pronunciation effortlessly.
                </p>
                {/* <p>{strings.easyTranslationsEllaboration1}</p>
                <p>{strings.easyTranslationsEllaboration2}</p>
                <p>{strings.easyTranslationsEllaboration3}</p> */}
              </s.SubsectionText>
            </s.Subsection>

            <s.Subsection>
              <s.SubsectionText>
                {/* <h3>{strings.personalizedExercises}</h3> */}
                <h3>Practice new words in&nbsp;context</h3>
                <p>
                  Test your vocabulary with many types of interactive exercises
                  that adapt to your level. Progress through increasing
                  difficulties, reinforce learning with real-world usage, and
                  improve pronunciation with audio exercises.
                </p>
                {/* <p>{strings.personalizedPractiseEllaboration1}</p>
                <p>{strings.personalizedMultipleExerciseTypes}</p>
                <p>{strings.personalizedPractiseEllaboration2}</p> */}
              </s.SubsectionText>
              <s.SubsectionImage src="static/images/feed.png" />
              {/* <img src="static/images/feed.png" />
              </s.SubsectionImage> */}
            </s.Subsection>
          </s.PageSection>
        </s.PageSectionWrapper>

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
