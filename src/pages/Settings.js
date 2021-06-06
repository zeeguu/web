import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { LanguageSelector } from "../components/LanguageSelector";

import { UserContext } from "../UserContext";
import LoadingAnimation from "../components/LoadingAnimation";

import * as s from "../components/FormPage.sc";
import * as sc from "../components/TopTabs.sc";
import { setTitle } from "../assorted/setTitle";

import LocalStorage from "../assorted/LocalStorage";

import strings from "../i18n/definitions";

export default function Settings({ api, setUser }) {
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const user = useContext(UserContext);
  const [languages, setLanguages] = useState();
  
  
  // TODO: Refactor using Zeeguu project logic
  const uiLanguages = [
    {
      name: "Danish",
      code: "da",
    },
    {
      name: "English",
      code: "en",
    },
  ];

  const [uiLanguage, setUiLanguage] = useState();
  useEffect(() => {
    const language = JSON.parse(localStorage.getItem("systemLanguage"));
    setUiLanguage(language);
  }, []);
  function onSysChange(lang) {
    setUiLanguage(lang);
  }


  useEffect(() => {
    api.getUserDetails((data) => {
      api.getSystemLanguages((systemLanguages) => {
        setLanguages(systemLanguages);
        setUserDetails(data);
      });
    });
    setTitle("Settings");
  }, [user.session, api]);

  function updateUserInfo(info) {
    LocalStorage.setUserInfo(info);
    setUser({
      ...user,
      name: info.name,
      learned_language: info.learned_language,
      native_language: info.native_language,
    });
  }

  function nativeLanguageUpdated(e) {
    let code = e.target[e.target.selectedIndex].getAttribute("code");
    setUserDetails({
      ...userDetails,
      native_language: code,
    });
  }

  function handleSave(e) {
    e.preventDefault();

    strings.setLanguage(uiLanguage.code);
    localStorage.setItem("systemLanguage", JSON.stringify(uiLanguage));

    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails);
      history.goBack();
    });
  }

  if (!userDetails || !languages) {
    return <LoadingAnimation />;
  }

  return (
    <s.FormContainer>
      <form className="formSettings">
        <sc.TopTabs>
          <h1>{strings.settings}</h1>
        </sc.TopTabs>

        <h5>{errorMessage}</h5>

        <label>{strings.name}</label>
        <input
          name="name"
          value={userDetails.name}
          onChange={(e) =>
            setUserDetails({ ...userDetails, name: e.target.value })
          }
        />
        <br />

        <label>{strings.email}</label>
        <input
          type="email"
          value={userDetails.email}
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
        />

        <label>{strings.learnedLanguage}</label>
        <LanguageSelector
          languages={languages.learnable_languages}
          selected={language_for_id(
            userDetails.learned_language,
            languages.learnable_languages
          )}
          onChange={(e) => {
            let code = e.target[e.target.selectedIndex].getAttribute("code");
            setUserDetails({
              ...userDetails,
              learned_language: code,
            });
          }}
        />

        <label>{strings.nativeLanguage}</label>
        <LanguageSelector
          languages={languages.native_languages}
          selected={language_for_id(
            userDetails.native_language,
            languages.native_languages
          )}
          onChange={nativeLanguageUpdated}
        />

        <label>{strings.systemLanguage}</label>
        <LanguageSelector
          languages={uiLanguages}
          selected={uiLanguage.name}
          onChange={(e) => {
            let lang = uiLanguages.find(lang => lang.code === e.target[e.target.selectedIndex].getAttribute("code")) 
            onSysChange(lang)
          }}
        />

        <div>
          <s.FormButton onClick={handleSave}>{strings.save}</s.FormButton>
        </div>
      </form>
    </s.FormContainer>
  );
}

function language_for_id(id, language_list) {
  for (let i = 0; i < language_list.length; i++) {
    if (language_list[i].code === id) {
      return language_list[i].name;
    }
  }
}
