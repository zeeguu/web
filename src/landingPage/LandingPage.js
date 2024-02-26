import strings from "../i18n/definitions";
import News from "./News";
import * as s from "./LandingPage.sc.js";
import Contributors from "./Contributors";
import { Redirect } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { setTitle } from "../assorted/setTitle";
import UiLanguageSettings from "../components/UiLanguageSettings";
import { getUserSession } from "../utils/cookies/userInfo";
import { useHistory } from "react-router-dom";

export default function LandingPage(setRedirectLink) {
  const [uiLanguage, setUiLanguage] = useState();
  const history = useHistory();

  useEffect(() => {
    setRedirectLink(null);
  }, []);

  if (getUserSession()) {
    return <Redirect to={{ pathname: "/articles" }} />;
  }

  const navigate = (path) => {
    history.push(path);
  };

  setTitle(strings.landingPage);
  return (
    <div>
      <s.LoginHeader>
        <s.HeaderTitle>Zeeguu</s.HeaderTitle>
        <UiLanguageSettings
          uiLanguage={uiLanguage}
          setUiLanguage={setUiLanguage}
        />
      </s.LoginHeader>

      <s.PageContent>
        <s.NarrowColumn>
          <s.BigLogo>
            <img src="/static/images/zeeguuLogo.svg" alt="elephant logo" />
          </s.BigLogo>
          <h1>Zeeguu</h1>
          <h4>{strings.projectDescription_UltraShort}</h4>
          <nav>
            <s.PrimaryButton onClick={() => navigate("/login")}>
              <span>{strings.login}</span>
            </s.PrimaryButton>
            <s.InverseButton onClick={() => navigate("/create_account")}>
              <span>{strings.betaTester}</span>
            </s.InverseButton>
          </nav>
        </s.NarrowColumn>

        <s.PaleAdaptableColumn>
          <h1>{strings.howDoesItWork}</h1>
          <h2>{strings.personalizedRecommandations}</h2>
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

          <h2>{strings.personalizedPractise}</h2>
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
    </div>
  );
}
