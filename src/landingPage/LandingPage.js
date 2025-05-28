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
          <h1>Learn a language by reading what you love and improve your&nbsp;vocabulary</h1>
          <p className="hero-paragraph">
            Zeeguu is a&nbsp;research project that helps you learn smarter - find interesting articles, translate words
            as&nbsp;you read, and use&nbsp;spaced repetition to&nbsp;remember&nbsp;them.
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
            <h2>What does Zeeguu&nbsp;offer?</h2>
            <s.ResponsiveRow>
              <s.ContentText>
                <h3>Browse your personalized&nbsp;feed</h3>
                <p>
                  Our system continuously searches the internet to&nbsp;bring you new article recommendations tailored
                  to&nbsp;your interests and desired language&nbsp;difficulty.
                </p>
              </s.ContentText>
              <s.ContentImage alt="" src="static/images/customized-feed.png" />
            </s.ResponsiveRow>

            <s.ResponsiveRow>
              <s.ContentImage
                alt="Clickable words: tap to translate and hear how they are pronounced"
                src="static/images/translation-pronunciation.png"
              />
              <s.ContentText>
                <h3>Read, translate words &&nbsp;hear&nbsp;pronunciation</h3>
                <p>
                  Select an&nbsp;article from your personalized feed and read it with ease. Right-click anywhere
                  on&nbsp;the&nbsp;page to&nbsp;activate distraction&#8209;free mode with our browser extension.
                  Instantly translate words and hear their pronunciation&nbsp;effortlessly.
                </p>
              </s.ContentText>
            </s.ResponsiveRow>

            <s.ResponsiveRow>
              <s.ContentText>
                <h3>Practice new words with&nbsp;spaced repetition and diverse&nbsp;exercises</h3>
                <p>
                  Build your vocabulary with fun, interactive exercises that adapt to&nbsp;your level. Practice with
                  real-life examples and audio, and remember words better thanks to&nbsp;spaced&nbsp;repetition.
                </p>
              </s.ContentText>
              <s.ContentImage
                alt="Spaced repetition is a studying technique that increases the time in-between review sessions"
                src="static/images/spaced-repetition-calendar.png"
              />
            </s.ResponsiveRow>
          </s.PageSection>
        </s.PageSectionWrapper>
        <s.PageSectionWrapper>
          <s.PageSection>
            <s.ResponsiveRow>
              <s.ContentImage className="square" alt="" src="static/images/zeeguu-for-teachers.png" />
              <s.ContentText>
                <h2 className="left-aligned">Zeeguu for&nbsp;Teachers</h2>
                <p className="subheadline left-aligned">
                  Let your students do the reading at home - and in class you can focus on speaking ;)
                </p>
                <ul>
                  <li>
                    <span className="strong">
                      See how much time your students read and practice vocabulary exercises
                    </span>
                  </li>
                  <li>
                    <span className="strong">Track the words they translate and the ones they struggle with</span>
                  </li>
                  <li>
                    <span className="strong">
                      Upload custom articles that students will see separately from the other recommendations
                    </span>
                  </li>
                </ul>
                <p>
                  To start using Zeeguu for Teachers, contact us at&nbsp;
                  <strong>zeeguu.team@gmail.com</strong>
                </p>
              </s.ContentText>
            </s.ResponsiveRow>
          </s.PageSection>
        </s.PageSectionWrapper>

        <s.PageSectionWrapper>
          <s.PageSection>
            <s.ResponsiveRow>
              <s.ContentText>
                <h2 className="left-aligned">Use Zeeguu like an&nbsp;App</h2>
                <ol>
                  <li>
                    Open <span className="strong">zeeguu.org</span> in your mobile browser (On&nbsp;Android, use Chrome.
                    On iPhone, use Safari or&nbsp;Chrome)
                  </li>
                  <li>
                    Tap the menu&nbsp;icon
                    <ul>
                      <li>
                        <span className="strong">On Android:</span> tap the three dots&nbsp;icon&nbsp;(⋮)
                      </li>
                      <li>
                        <span className="strong">On iPhone:</span> tap the Share&nbsp;icon&nbsp;(🔗)
                      </li>
                    </ul>
                  </li>
                  <li>
                    Select <span className="strong">“Add to Home Screen”</span> (or “Install App” on&nbsp;Android)
                  </li>
                  <li>
                    Confirm by tapping&nbsp;<span className="strong">Add</span>
                  </li>
                </ol>
                <p>Zeeguu will now appear on your home screen, just like a regular&nbsp;app!</p>
              </s.ContentText>
              <s.ContentImage className="square" alt="" src="static/images/zeeguu-for-teachers.png" />
            </s.ResponsiveRow>
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
