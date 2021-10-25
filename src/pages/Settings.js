import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UiLanguageSelector from "../components/UiLanguageSelector";
import { UserContext } from "../UserContext";
import { setTitle } from "../assorted/setTitle";
import LocalStorage from "../assorted/LocalStorage";
import LoadingAnimation from "../components/LoadingAnimation";
import * as s from "../components/FormPage.sc";
import * as sc from "../components/TopTabs.sc";
import * as scs from "./Settings.sc";
import uiLanguages from "../assorted/uiLanguages";
import strings from "../i18n/definitions";
import { Error } from "../teacher/sharedComponents/Error";
import Select from "../components/Select";
import { CEFR_LEVELS } from "../assorted/cefrLevels";

export default function Settings({ api, setUser }) {
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const user = useContext(UserContext);
  const [languages, setLanguages] = useState();
  const [inviteCode, setInviteCode] = useState("");
  const [showJoinCohortError, setShowJoinCohortError] = useState(false);
  const [currentCohort, setCurrentCohort] = useState("");
  const [cefr, setCEFR] = useState("");

  // TODO: Refactor using Zeeguu project logic

  const [uiLanguage, setUiLanguage] = useState();

  useEffect(() => {
    const language = LocalStorage.getUiLanguage();
    setUiLanguage(language);
    setTitle(strings.settings);
    // eslint-disable-next-line
  }, []);

  function onSysChange(lang) {
    setUiLanguage(lang);
  }

  function setCEFRlevel(data) {
    const levelKey = data.learned_language + "_cefr_level";
    const levelNumber = data[levelKey];
    console.log(
      "/get_user_details returns " + levelNumber + " as the current CEFR."
    );
    setCEFR("" + levelNumber);
  }

  const modifyCEFRlevel = (languageID, cefrLevel) => {
    api.modifyCEFRlevel(
      languageID,
      cefrLevel,
      (res) => {
        console.log("Clicked on 'Save'...");
        console.log(
          "Modifying language: '" +
            languageID +
            "' to CEFR level: " +
            cefrLevel +
            " using: /user_languages/modify"
        );
        console.log("API returns update status: " + res);
        console.log(
          "Clicking on 'Save' automatically redirects to 'My Texts'..."
        );
        console.log(
          "Going back to 'Settings', /get_user_details should return: " +
            cefr +
            " - BUT..."
        );
      },
      () => {
        console.log("Connection to server failed...");
      }
    );
  };

  useEffect(() => {
    if (cefr !== "" && cefr !== "4") {
      console.log("Changed CEFR to " + cefr + " in the dropdown...");
    }
  }, [cefr]);

  useEffect(() => {
    console.log("Clicked on 'Settings'...");
    api.getUserDetails((data) => {
      api.getSystemLanguages((systemLanguages) => {
        setLanguages(systemLanguages);
        setUserDetails(data);
        setCEFRlevel(data);
      });
    });
    api.getStudent((student) => {
      if (student.cohort_id !== null) {
        api.getCohortName(student.cohort_id, (cohort) =>
          setCurrentCohort(cohort.name)
        );
      }
    });
  }, [user.session, api]);

  const studentIsInCohort = currentCohort !== "";

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
    LocalStorage.setUiLanguage(uiLanguage);

    modifyCEFRlevel(userDetails.learned_language, cefr);

    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails);
      history.goBack();
    });
  }

  function handleInviteCodeChange(event) {
    setShowJoinCohortError(false);
    setInviteCode(event.target.value);
  }

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
      <scs.StyledSettings>
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
          <UiLanguageSelector
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

          <label>{strings.levelOfLearnedLanguage}</label>
          <Select
            elements={CEFR_LEVELS}
            label={(e) => e.label}
            val={(e) => e.value}
            updateFunction={setCEFR}
            current={cefr}
          />

          <label>{strings.nativeLanguage}</label>
          <UiLanguageSelector
            languages={languages.native_languages}
            selected={language_for_id(
              userDetails.native_language,
              languages.native_languages
            )}
            onChange={nativeLanguageUpdated}
          />

          <label>{strings.systemLanguage}</label>
          <UiLanguageSelector
            languages={uiLanguages}
            selected={uiLanguage.name}
            onChange={(e) => {
              let lang = uiLanguages.find(
                (lang) =>
                  lang.code ===
                  e.target[e.target.selectedIndex].getAttribute("code")
              );
              onSysChange(lang);
            }}
          />

          <div>
            <s.FormButton onClick={handleSave}>{strings.save}</s.FormButton>
          </div>
        </form>

        {!user.is_teacher && (
          <div>
            <p className="current-class-of-student">
              <b>
                {studentIsInCohort
                  ? strings.yourCurrentClassIs + currentCohort
                  : strings.youHaveNotJoinedAClass}
              </b>
            </p>
            <label className="change-class-string">
              {studentIsInCohort ? strings.changeClass : strings.joinClass}
            </label>
            <input
              type="text"
              placeholder={
                studentIsInCohort
                  ? strings.insertNewInviteCode
                  : strings.insertInviteCode
              }
              value={inviteCode}
              onChange={(event) => handleInviteCodeChange(event)}
            />

            {showJoinCohortError && (
              <Error message={strings.checkIfInviteCodeIsValid} />
            )}

            <s.FormButton onClick={saveStudentToClass}>
              {studentIsInCohort ? strings.changeClass : strings.joinClass}
            </s.FormButton>
          </div>
        )}
      </scs.StyledSettings>
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
