import React, { useEffect, useState } from "react";
import { Input } from "../../../components/input/Input";
import strings from "../../../i18n/definitions";
import { Dropdown } from "../../../components/dropdown/Dropdown";
import { CEFR_LEVELS } from "../../../assorted/cefrLevels";
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
  const [cefr, setCEFR] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState(null);
  const [uiLanguage, setUiLanguage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

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
        setIsSuccess(true);
        setIsError(false);
        setIsLoading(false);
      },
      () => {
        setIsError(true);
        setIsLoading(false);
      }
    );

    api.saveUserDetails(
      {
        ...userDetails,
        learned_language: learnedLanguage?.code,
        native_language: nativeLanguage?.code,
      },
      () => {
        setIsError(true);
        setIsLoading(false);
      },
      () => {
        LocalStorage.setUserInfo(userDetails);
        setUser({
          ...user,
          name: userDetails.name,
          learned_language: userDetails.learned_language,
          native_language: userDetails.native_language,
        });
        setIsSuccess(true);
        setIsError(false);
        setIsLoading(false);
      }
    );
  };
  const handleSetSefr = (item) => {
    setCEFR(item.value - 1);
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

  useEffect(() => {
    let removeSuccess;

    if (isSuccess) {
      removeSuccess = setTimeout(() => setIsSuccess(false), 3000);
    }

    return () => clearTimeout(removeSuccess);
  }, [isSuccess, setIsSuccess]);

  if (!userDetails || !languages) {
    return <CircularProgress style={{ alignSelf: "center" }} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
        value={CEFR_LEVELS[cefr].name}
        items={Object.values(CEFR_LEVELS)}
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
      {isSuccess && (
        <scs.SuccessText>{strings.settingsSuccess}</scs.SuccessText>
      )}
      {isError && <scs.ErrorText>{strings.settingsSuccess}</scs.ErrorText>}
      <scs.SettingButton onClick={handleSave}>
        {isLoading && <CircularProgress />}
        {!isLoading && strings.save}
      </scs.SettingButton>
    </div>
  );
};
