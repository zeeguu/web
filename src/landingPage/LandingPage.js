import strings from "../i18n/definitions";
import News from "./News";
import * as s from "./LandingPage.sc.js";
import Contributors from "./Contributors";
import { Redirect } from "react-router-dom";
import { setTitle } from "../assorted/setTitle";
import { getSessionFromCookies } from "../utils/cookies/userInfo";
import { Button } from "../pages/_pages_shared/Button.sc";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import redirect from "../utils/routing/routing.js";

export default function LandingPage() {
  if (getSessionFromCookies()) {
    return <Redirect to={{ pathname: "/articles" }} />;
  }

  setTitle("All You Can Read");
  return (
    <s.PageWrapper>
      <s.NavbarBg>
        <s.Navbar>
          <s.LogoWithText>
            <s.ZeeguuLogo
              src="/static/images/zeeguuWhiteLogo.svg"
              alt="elephant logo"
            />
            Zeeguu
          </s.LogoWithText>
          <s.NavbarButtonContainer>
            <s.WhiteOutlinedNavbarBtn onClick={() => redirect("/log_in")}>
              {strings.login}
            </s.WhiteOutlinedNavbarBtn>
            <s.WhiteFilledNavbarBtn
              onClick={() => redirect("/language_preferences")}
            >
              {strings.register}
            </s.WhiteFilledNavbarBtn>
          </s.NavbarButtonContainer>

          {/* temporarily disable UI language settings */}
          {/* <UiLanguageSettings
          uiLanguage={uiLanguage}
          setUiLanguage={setUiLanguage}
        /> */}
        </s.Navbar>
      </s.NavbarBg>

      <s.PageContent>
        <s.HeroColumn>
          <h1>Learn foreign languages while reading what you&nbsp;like</h1>
          <p className="hero-paragraph">
            {strings.projectDescription_UltraShort}
          </p>
          <Button onClick={() => redirect("/language_preferences")}>
            {strings.getStarted}
            <ArrowForwardRoundedIcon />
          </Button>
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
