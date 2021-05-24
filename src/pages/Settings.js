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
 
  //Student enrolls in a class
  function saveStudentToClass() {
    console.log("INVITE CODE")
    console.log(inviteCode)

    api.joinCohort(inviteCode, 
      (result) => {
      console.log("Result is : " + result)
      result==="OK" &&
      history.push("/articles/classroom")
      }, 
      (result) => {console.log("OnError - This is an invalid invitecode")}
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

      <label style={{ paddingTop: "1rem"}}>"STRINGS Join Class"</label>
          <input
          type="class"
          placeholder="Insert class invitecode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        
        {/* This should only happen if an invalid invite code is entered */}
        <p style={{ color: "red", marginTop:"0" }}> 
        The invite code is invalid. Please try again. STRINGS 
        </p>

        <div>
          <s.FormButton onClick={saveStudentToClass}> STRINGS Enroll </s.FormButton>
        </div>
       
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
