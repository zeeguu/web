import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import News from "./News";
import * as s from "./LandingPage.sc.js";
import Contributors from "./Contributors";
import { Redirect } from "react-router-dom";
import React, { useState } from "react";
import LanguageSettings from "../components/LanguageSettings";

export default function LandingPage() {
  const [,forceUpdateHook] = useState(0);

  localStorage.setItem("systemLanguage", JSON.stringify({
    name: "Dansk",
    code: "da",
  }));
  if (LocalStorage.hasSession()) {
    return <Redirect to={{ pathname: "/articles" }} />;
  }
  
  return (
    <div>
      <s.LoginHeader>
        <s.HeaderTitle>Zeeguu</s.HeaderTitle>
        <LanguageSettings
          updateApp={() => forceUpdateHook((value) => value + 1)}
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
            <s.PrimaryButton>
              <a href="/login">{strings.login}</a>
            </s.PrimaryButton>
            <s.InverseButton>
              <a href="./create_account">{strings.betaTester}</a>
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
