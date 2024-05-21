import strings from "../i18n/definitions";
import News from "./News";
import * as s from "./LandingPage.sc.js";
import Contributors from "./Contributors";
import { Redirect } from "react-router-dom";
import { setTitle } from "../assorted/setTitle";
import { getSessionFromCookies } from "../utils/cookies/userInfo";
import Button from "../pages/info_page_shared/Button.js";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import redirect from "../utils/routing/routing.js";

export default function LandingPage() {
  if (getSessionFromCookies()) {
    return <Redirect to={{ pathname: "/articles" }} />;
  }

  setTitle("All You Can Read");
  return (
    <s.PageWrapper>
      <s.Navbar>
        <s.NavbarContent>
          <s.Logotype>
            <s.BigLogo
              src="/static/images/zeeguuWhiteLogo.svg"
              alt="elephant logo"
            />
            Zeeguu
          </s.Logotype>
          <s.NavbarButtonContainer>
            <s.WhiteOutlinedNavbarBtn onClick={() => redirect("/login")}>
              Log in
            </s.WhiteOutlinedNavbarBtn>
            <s.WhiteFilledNavbarBtn onClick={() => redirect("/create_account")}>
              Register
            </s.WhiteFilledNavbarBtn>
          </s.NavbarButtonContainer>

          {/* temporarily disable UI language settings */}
          {/* <UiLanguageSettings
          uiLanguage={uiLanguage}
          setUiLanguage={setUiLanguage}
        /> */}
        </s.NavbarContent>
      </s.Navbar>

      <s.PageContent>
        <s.NarrowColumn>
          <h1>Learn foreign languages with&nbsp;Zeeguu</h1>
          <p className="hero-paragraph">
            Zeeguu is a research project that personalizes the way you learn
            foreign languages. It lets you read texts based on your interests,
            translate unfamiliar words, and practice vocabulary. On any device.
          </p>
          <Button onClick={() => redirect("/create_account")}>
            Get Started
            <ArrowForwardRoundedIcon />
          </Button>
        </s.NarrowColumn>

        <s.PaleAdaptableColumn>
          <h1>{strings.howDoesItWork}</h1>
          <h2>Personalized Reading</h2>
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

          <h2>Personalized Exercises</h2>
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
