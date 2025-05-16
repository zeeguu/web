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
            <p className="subheadline">
              Zeeguu is a research project that personalizes the way you learn
              foreign&nbsp;languages
            </p>

            <s.Subsection>
              <s.SubsectionText>
                <h3>Browse your personalized&nbsp;feed</h3>
                <p>
                  Our system continuously searches the internet to&nbsp;bring
                  you new article recommendations tailored to&nbsp;your
                  interests and desired language&nbsp;difficulty.
                </p>
              </s.SubsectionText>
              <s.SubsectionImage src="static/images/customized-feed.png" />
            </s.Subsection>

            <s.Subsection>
              <s.SubsectionImage src="static/images/translation-pronunciation.png" />
              <s.SubsectionText>
                <h3>Read, translate words &&nbsp;hear&nbsp;pronunciation</h3>
                <p>
                  Select an article from your personalized feed and
                  read&nbsp;it&nbsp;with ease. Right-click anywhere on&nbsp;the
                  page to&nbsp;activate distraction&#8209;free mode with our
                  browser extension. Instantly translate words and hear their
                  pronunciation&nbsp;effortlessly.
                </p>
              </s.SubsectionText>
            </s.Subsection>

            <s.Subsection>
              <s.SubsectionText>
                <h3>Practice new words with&nbsp;spaced&nbsp;repetition</h3>
                <p>
                  Build your vocabulary with fun, interactive exercises that
                  adapt to&nbsp;your level. Practice with real-life examples and
                  audio, and remember words better thanks
                  to&nbsp;spaced&nbsp;repetition.
                </p>
              </s.SubsectionText>
              <s.SubsectionImage src="static/images/spaced-repetition-calendar.png" />
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
