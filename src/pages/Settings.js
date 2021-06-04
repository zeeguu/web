import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { LanguageSelector } from "../components/LanguageSelector";
import { UserContext } from "../UserContext";
import { setTitle } from "../assorted/setTitle";
import LocalStorage from "../assorted/LocalStorage";
import LoadingAnimation from "../components/LoadingAnimation";
import * as s from "../components/FormPage.sc";
import * as sc from "../components/TopTabs.sc";
import strings from "../i18n/definitions";
import { Error } from "../teacher/Error";

export default function Settings({ api, setUser }) {
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const user = useContext(UserContext);
  const [languages, setLanguages] = useState();
  const [inviteCode, setInviteCode] = useState("");
  const [showJoinCohortError, setShowJoinCohortError] = useState(false);
  const [currentCohort, setCurrentCohort] = useState("");

  useEffect(() => {
    api.getUserDetails((data) => {
      api.getSystemLanguages((systemLanguages) => {
        setLanguages(systemLanguages);
        setUserDetails(data);
      });
    });
    api.getStudent((student) => {
      if (student.cohort_id !== null) {
        api.getCohortName(student.cohort_id, (cohort)=> setCurrentCohort(cohort.name))
      }
    });
    setTitle("Settings");
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
          <p style={{ margin: "25px 0 -5px 0" }}>
            <b>
              {studentIsInCohort
                ? strings.yourCurrentClassIs + currentCohort
                : strings.youHaveNotJoinedAClass}
            </b>
          </p>
          <label style={{ paddingTop: "1rem" }}>
            {studentIsInCohort ? strings.changeClassbtn : strings.joinClass}
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
            {studentIsInCohort ? strings.changeClassbtn : strings.joinClass}
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
