import React, { useEffect, useState } from "react";
import { Input } from "../../../components/input/Input";
import strings from "../../../i18n/definitions";
import { Dropdown } from "../../../components/dropdown/Dropdown";
import { CEFR_LEVELS_FOR_SETTINGS } from "../../../assorted/cefrLevels";
import * as scs from "../Settings.sc";
import LocalStorage from "../../../assorted/LocalStorage";
import uiLanguages from "../../../assorted/uiLanguages";
import { useHistory } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export const PersonalData = ({ api, setUser, user }) => {
  const history = useHistory();

  const [showJoinCohortError, setShowJoinCohortError] = useState(false);
  const [currentCohort, setCurrentCohort] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [languages, setLanguages] = useState();
  const [learnedLanguage, setLearnedLanguage] = useState(null);
  const [cefr, setCEFR] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState(null);
  const [uiLanguage, setUiLanguage] = useState(null);

  const handleChangeUiLanguage = (languageItem) => {
    setUiLanguage(uiLanguages.find((lang) => lang.code === languageItem.code));
  };

  // const studentIsInCohort = currentCohort !== "";
  //

  // function handleInviteCodeChange(event) {
  //   setShowJoinCohortError(false);
  //   setInviteCode(event.target.value);
  // }

  const saveStudentToClass = (e) => {
    e.preventDefault();

    api.joinCohort(
      inviteCode,
      (status) => {
        status === "OK"
          ? history.push("/articles/classroom")
          : setShowJoinCohortError(true);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleSave = () => {
    strings.setLanguage(uiLanguage.code);
    LocalStorage.setUiLanguage(uiLanguage);

    api.modifyCEFRlevel(
      userDetails.learned_language,
      cefr,
      (res) => {
        console.log(
          "Update '" + userDetails.learned_language + "' CEFR level to: " + cefr
        );
        console.log("API returns update status: " + res);
      },
      () => {
        console.log("Connection to server failed...");
      }
    );
    console.log(userDetails);
    api.saveUserDetails(
      {
        ...userDetails,
        learned_language: learnedLanguage?.code,
        native_language: nativeLanguage?.code,
      },
      () => {},
      () => {
        LocalStorage.setUserInfo(userDetails);
        setUser({
          ...user,
          name: userDetails.name,
          learned_language: userDetails.learned_language,
          native_language: userDetails.native_language,
        });
      }
    );
  };

  const handleSetSefr = (item) => {
    setCEFR(item.value);
  };

  useEffect(() => {
    api.getUserDetails((data) => {
      setUserDetails(data);
      setCEFR(data[data.learned_language + "_cefr_level"]);
    });
    api.getSystemLanguages((systemLanguages) => {
      setLanguages(systemLanguages);
    });
    api.getStudent((student) => {
      if (student.cohort_id !== null) {
        api.getCohortName(student.cohort_id, (cohort) =>
          setCurrentCohort(cohort.name)
        );
      }
    });
  }, [user?.session, api]);

  useEffect(() => {
    setUiLanguage(LocalStorage.getUiLanguage());
  }, []);

  useEffect(() => {
    if (userDetails?.learned_language && languages)
      setLearnedLanguage(
        languages?.learnable_languages.find(
          (item) => item.code === userDetails?.learned_language
        )
      );
  }, [userDetails?.learned_language, languages]);

  useEffect(() => {
    if (userDetails?.native_language && languages) {
      setNativeLanguage(
        languages?.native_languages.find(
          (item) => item.code === userDetails?.native_language
        )
      );
    }
  }, [userDetails?.native_language, languages]);

  if (!userDetails || !languages) {
    return <CircularProgress style={{ alignSelf: "center" }} />;
  }

  return (
    <div>
      <Input
        isPlainText
        title={strings.name}
        value={userDetails.name}
        onChange={(value) => setUserDetails({ ...userDetails, name: value })}
      />

      <Input
        isEmail
        title={strings.email}
        value={userDetails.email}
        onChange={(value) => setUserDetails({ ...userDetails, email: value })}
      />

      <Dropdown
        title={strings.learnedLanguage}
        placeholder={strings.chooseLearnedLanguage}
        value={learnedLanguage?.name}
        items={languages?.learnable_languages}
        onChange={setLearnedLanguage}
      />

      <Dropdown
        title={strings.levelOfLearnedLanguage}
        placeholder={strings.choseLevelOfLearnedLanguage}
        value={CEFR_LEVELS_FOR_SETTINGS[cefr - 1].name}
        items={CEFR_LEVELS_FOR_SETTINGS}
        onChange={handleSetSefr}
      />

      <Dropdown
        title={strings.nativeLanguage}
        placeholder={strings.choseNativeLanguage}
        value={nativeLanguage?.name}
        items={languages?.native_languages}
        onChange={setNativeLanguage}
      />

      <Dropdown
        title={strings.systemLanguage}
        placeholder={strings.choseSystemLanguage}
        value={uiLanguage?.name}
        items={uiLanguages}
        onChange={handleChangeUiLanguage}
      />

      <scs.SettingButton onClick={handleSave}>{strings.save}</scs.SettingButton>
    </div>
  );
};
