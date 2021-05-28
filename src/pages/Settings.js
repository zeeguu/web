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
  const [inviteCode, setInviteCode] = useState("");
  const [showJoinCohortError, setShowJoinCohortError] = useState(false);

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

    strings.setLanguage(code);
    setUserDetails({
      ...userDetails,
      native_language: code,
    });
  }

  function handleSave(e) {
    e.preventDefault();

    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails);
      history.goBack();
    });
  }

  function handleInviteCodeChange(event) {
    setShowJoinCohortError(false);
    setInviteCode(event.target.value);
  }
  //Student enrolls in a class
  function saveStudentToClass() {
    api.joinCohort(
      inviteCode,
      (status) => {
        console.log(status);
        status === "OK"
          ? history.push("/articles/classroom")
          : setShowJoinCohortError(true);
      },
      (error) => {
        console.log(error);
      }
    );
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

        <div>
          <s.FormButton onClick={handleSave}>{strings.save}</s.FormButton>
        </div>
      </form>

      {!user.is_teacher && process.env.REACT_APP_NEW_TEACHER_SITE === "true" && (
        <div>
          <label style={{ paddingTop: "1rem" }}>"STRINGS Join class"</label>
          <input
            type="text"
            placeholder="Insert class invite code"
            value={inviteCode}
            onChange={(event) => handleInviteCodeChange(event)}
          />

          {showJoinCohortError && (
            <p style={{ color: "red", marginTop: "0" }}>
              Something went wrong. Please check that the invite code is valid
              and try again. STRINGS
            </p>
          )}

          <s.FormButton onClick={saveStudentToClass}>
            STRINGS Join class
          </s.FormButton>
        </div>
      )}
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
