import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UiLanguageSelector from "../components/UiLanguageSelector";
import { UserContext } from "../contexts/UserContext";
import { setTitle } from "../assorted/setTitle";
import LocalStorage from "../assorted/LocalStorage";
import LoadingAnimation from "../components/LoadingAnimation";
import * as s from "../components/FormPage.sc";
import * as scs from "./Settings.sc";
import strings from "../i18n/definitions";
import { Error } from "../teacher/sharedComponents/Error";
import Select from "../components/Select";
import { CEFR_LEVELS } from "../assorted/cefrLevels";
import { saveUserInfoIntoCookies } from "../utils/cookies/userInfo";
import { PageTitle } from "../components/PageTitle";
import Feature from "../features/Feature";
import SessionStorage from "../assorted/SessionStorage";
import DeleteAccountButton from "./DeleteAccountButton";

import SettingsItem from "./settings_pages_shared/SettingsItem";
import ListOfSettingsItems from "./settings_pages_shared/ListOfSettingsItems";

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
  const [audioExercises, setAudioExercises] = useState(true);

  let preferenceNotSet =
    LocalStorage.getProductiveExercisesEnabled() === undefined;

  const [productiveExercises, setProductiveExercises] = useState(
    preferenceNotSet || LocalStorage.getProductiveExercisesEnabled(),
  );
  //TODO: Refactor using Zeeguu project logic

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
    setCEFR("" + levelNumber);
    setUserDetails({
      ...data,
      cefr_level: levelNumber,
    });
  }

  useEffect(() => {
    api.getUserDetails((data) => {
      setUserDetails(data);
      setCEFRlevel(data);
    });
    api.getUserPreferences((preferences) => {
      setAudioExercises(
        (preferences["audio_exercises"] === undefined ||
          preferences["audio_exercises"] === "true") &&
          SessionStorage.isAudioExercisesEnabled(),
      );
    });
    api.getSystemLanguages((systemLanguages) => {
      setLanguages(systemLanguages);
    });
    api.getStudent((student) => {
      if (student.cohort_id !== null) {
        api.getCohortName(student.cohort_id, (cohort) =>
          setCurrentCohort(cohort.name),
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

    saveUserInfoIntoCookies(info);
  }

  function getLanguageCodeFromSelector(e) {
    return e.target[e.target.selectedIndex].getAttribute("code");
  }

  function updateNativeLanguage(lang_code) {
    setUserDetails({
      ...userDetails,
      native_language: lang_code,
    });
  }

  function updateCEFRLevel(level) {
    setUserDetails({
      ...userDetails,
      cefr_level: level,
    });
  }

  function updateLearnedLanguage(lang_code) {
    setUserDetails({
      ...userDetails,
      learned_language: lang_code,
    });
  }

  function handleSave(e) {
    e.preventDefault();

    strings.setLanguage(uiLanguage.code);
    LocalStorage.setUiLanguage(uiLanguage);

    // modifyCEFRlevel(userDetails.learned_language, cefr);

    SessionStorage.setAudioExercisesEnabled(audioExercises);
    api.saveUserPreferences({
      audio_exercises: audioExercises,
      productive_exercises: productiveExercises,
    });

    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails);
      if (history.length > 1) {
        history.goBack();
      } else {
        window.close();
      }
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
        status === "OK"
          ? history.push("/articles/classroom")
          : setShowJoinCohortError(true);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  function handleAudioExercisesChange(e) {
    setAudioExercises((state) => !state);
  }

  function handleProductiveExercisesChange(e) {
    // Toggle the state locally
    setProductiveExercises((state) => !state);

    // Update local storage
    const newProductiveValue = !productiveExercises;
    localStorage.setItem(
      "productiveExercisesEnabled",
      JSON.stringify(newProductiveValue),
    );
  }

  if (!userDetails || !languages) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <PageTitle>{strings.settings}</PageTitle>

      <ListOfSettingsItems header={"My Account"}>
        <SettingsItem path={"/"}>Profile Details</SettingsItem>
        <SettingsItem path={"/"}> Languages</SettingsItem>

        {!user.is_teacher && (
          <SettingsItem path={"/"}> My Current Class</SettingsItem>
        )}
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Exercise Preferences"}>
        <SettingsItem path={"/"}> Audio Exercises</SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Reading Preferences"}>
        <SettingsItem path={"/account_settings/interests"}>
          {" "}
          Interests
        </SettingsItem>
        <SettingsItem path={"/account_settings/non_interests"}>
          {" "}
          Non-Interests
        </SettingsItem>
      </ListOfSettingsItems>

      <ListOfSettingsItems header={"Account Management"}>
        <SettingsItem path={"/account_settings/delete_account"}>
          Delete Account
        </SettingsItem>
      </ListOfSettingsItems>

      <s.FormContainer>
        <scs.StyledSettings>
          <form className="formSettings">
            <h5>{errorMessage}</h5>
            <b>Account Settings</b>
            <hr></hr>
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

            <br />
            <br />
            <label>{strings.learnedLanguage}</label>
            <UiLanguageSelector
              languages={languages.learnable_languages}
              selected={language_for_id(
                userDetails.learned_language,
                languages.learnable_languages,
              )}
              onChange={(e) => {
                updateLearnedLanguage(getLanguageCodeFromSelector(e));
              }}
            />

            <Select
              elements={CEFR_LEVELS}
              label={(e) => e.label}
              val={(e) => e.value}
              updateFunction={(e) => {
                updateCEFRLevel(e);
              }}
              current={cefr}
            />

            <br />
            <br />

            <label>{strings.nativeLanguage}</label>
            <UiLanguageSelector
              languages={languages.native_languages}
              selected={language_for_id(
                userDetails.native_language,
                languages.native_languages,
              )}
              onChange={(e) => {
                updateNativeLanguage(getLanguageCodeFromSelector(e));
              }}
            />

            <label>Exercise Type Preferences</label>
            <div style={{ display: "flex" }} className="form-group">
              <input
                style={{ width: "1.5em" }}
                type={"checkbox"}
                checked={audioExercises}
                onChange={handleAudioExercisesChange}
              />
              <label>
                Include Audio Exercises{" "}
                {SessionStorage.isAudioExercisesEnabled()
                  ? ""
                  : "(Temporaly Disabled)"}
              </label>
            </div>
            {Feature.merle_exercises() && (
              <div style={{ display: "flex" }} className="form-group">
                <input
                  style={{ width: "1.5em" }}
                  type={"checkbox"}
                  checked={productiveExercises}
                  onChange={handleProductiveExercisesChange}
                />
                <label>Enable Productive Exercises</label>
              </div>
            )}
            <div>
              <s.FormButton onClick={handleSave}>
                <span>{strings.save}</span>
              </s.FormButton>
            </div>
            {!user.is_teacher && (
              <>
                <b>Class Management</b>
                <hr></hr>
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
                  <span>
                    {studentIsInCohort
                      ? strings.changeClass
                      : strings.joinClass}
                  </span>
                </s.FormButton>
              </>
            )}
          </form>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <b>Account Management</b>
          <hr></hr>
          <DeleteAccountButton />
        </scs.StyledSettings>
      </s.FormContainer>
    </>
  );
}

function language_for_id(id, language_list) {
  for (let i = 0; i < language_list.length; i++) {
    console.log(language_list[i].code, id);
    if (language_list[i].code === id) {
      return language_list[i].name;
    }
  }
}
