import { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import LoadingAnimation from "../../components/LoadingAnimation";
import * as s from "../../components/Theme.sc";
import * as scs from "./Settings.sc";
import strings from "../../i18n/definitions";
import { Class } from "./class/Class";
import { Content } from "./content/Content";
import { PersonalData } from "./personalData/PersonalData";
import { zeeguuSecondOrange } from "../../components/colors";

const settingsRoute = "/account_settings";

const activeLinkStyle = {
  color: zeeguuSecondOrange,
  padding: "4px 0",
  borderBottom: `1px ${zeeguuSecondOrange} solid`,
};

const settingsVariants = {
  personalData: {
    title: strings.personalData,
    name: "personalData",
    route: "/personalData",
  },
  class: {
    title: strings.class,
    name: "class",
    route: "/class",
  },
  content: {
    title: strings.content,
    name: "content",
    route: "/content",
  },
};

export default function Settings({ api, setUser }) {
  const history = useHistory();
  const location = useLocation();

  const [currentSettings, setCurrentSettings] = useState(
    location.pathname.split("/")[2]
  );
  const [userDetails, setUserDetails] = useState(null);
  const user = useContext(UserContext);
  const [languages, setLanguages] = useState();
  // const [inviteCode, setInviteCode] = useState('')
  // const [showJoinCohortError, setShowJoinCohortError] = useState(false)
  const [currentCohort, setCurrentCohort] = useState("");
  const [cefr, setCEFR] = useState("");

  // const [uiLanguage, setUiLanguage] = useState()

  useEffect(() => {
    if (!currentSettings)
      history.push(settingsRoute + settingsVariants.personalData.route);

    setCurrentSettings(location.pathname.split("/")[2]);
  }, [location]);

  // useEffect(() => {
  //   const language = LocalStorage.getUiLanguage()
  //   setUiLanguage(language)
  //   setTitle(strings.settings)
  //   // eslint-disable-next-line
  // }, [])
  //
  // function onSysChange(lang) {
  //   setUiLanguage(lang)
  // }

  function setCEFRlevel(data) {
    const levelKey = data.learned_language + "_cefr_level";
    const levelNumber = data[levelKey];
    setCEFR("" + levelNumber);
  }

  // const modifyCEFRlevel = (languageID, cefrLevel) => {
  //   api.modifyCEFRlevel(
  //     languageID,
  //     cefrLevel,
  //     (res) => {
  //       console.log('Update \'' + languageID + '\' CEFR level to: ' + cefrLevel)
  //       console.log('API returns update status: ' + res)
  //     },
  //     () => {
  //       console.log('Connection to server failed...')
  //     },
  //   )
  // }

  useEffect(() => {
    api.getUserDetails((data) => {
      setUserDetails(data);
      setCEFRlevel(data);
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
  }, [user.session, api]);

  // const studentIsInCohort = currentCohort !== ''

  // function updateUserInfo(info) {
  //   LocalStorage.setUserInfo(info)
  //   setUser({
  //     ...user,
  //     name: info.name,
  //     learned_language: info.learned_language,
  //     native_language: info.native_language,
  //   })
  //
  //   saveUserInfoIntoCookies(info)
  // }

  // function nativeLanguageUpdated(e) {
  //   let code = e.target[e.target.selectedIndex].getAttribute('code')
  //   setUserDetails({
  //     ...userDetails,
  //     native_language: code,
  //   })
  // }

  // function handleSave(e) {
  //   e.preventDefault()
  //
  // strings.setLanguage(uiLanguage.code)
  // LocalStorage.setUiLanguage(uiLanguage)
  //
  // modifyCEFRlevel(userDetails.learned_language, cefr)
  //
  // api.saveUserDetails(userDetails, setErrorMessage, () => {
  //   updateUserInfo(userDetails)
  //   history.goBack()
  // })
  // }

  // function handleInviteCodeChange(event) {
  //   setShowJoinCohortError(false)
  //   setInviteCode(event.target.value)
  // }
  //
  // function saveStudentToClass() {
  //   api.joinCohort(
  //     inviteCode,
  //     (status) => {
  //       status === 'OK'
  //         ? history.push('/articles/classroom')
  //         : setShowJoinCohortError(true)
  //     },
  //     (error) => {
  //       console.log(error)
  //     },
  //   )
  // }

  if (!userDetails || !languages) {
    return <LoadingAnimation />;
  }

  return (
    <scs.SettingContainer>
      <scs.StyledSettings>
        <s.H1>{strings.settings}</s.H1>

        <scs.NavList>
          {Object.values(settingsVariants).map((settingVariant) => (
            <li>
              <Link
                key={settingVariant.name}
                to={settingsRoute + settingVariant.route}
                style={
                  currentSettings === settingVariant.name ? activeLinkStyle : {}
                }
              >
                {settingVariant.title}
              </Link>
            </li>
          ))}
        </scs.NavList>

        {currentSettings === settingsVariants.personalData.name && (
          <PersonalData
            userDetails={userDetails}
            setUserDetails={setUserDetails}
          />
        )}

        {currentSettings === settingsVariants.class.name && (
          <Class userDetails={userDetails} setUserDetails={setUserDetails} />
        )}

        {currentSettings === settingsVariants.content.name && (
          <Content userDetails={userDetails} setUserDetails={setUserDetails} />
        )}

        {/*<UiLanguageSelector
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

        <Select
          elements={CEFR_LEVELS}
          label={(e) => e.label}
          val={(e) => e.value}
          updateFunction={setCEFR}
          current={cefr}
        />

        <UiLanguageSelector
          languages={languages.native_languages}
          selected={language_for_id(
            userDetails.native_language,
            languages.native_languages
          )}
          onChange={nativeLanguageUpdated}
        />

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


        {!user.is_teacher && (
          <div>
            <p className='current-class-of-student'>
              <b>
                {studentIsInCohort
                  ? strings.yourCurrentClassIs + currentCohort
                  : strings.youHaveNotJoinedAClass}
              </b>
            </p>
            <label className='change-class-string'>
              {studentIsInCohort ? strings.changeClass : strings.joinClass}
            </label>
            <input
              type='text'
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
        )}*/}
      </scs.StyledSettings>
    </scs.SettingContainer>
  );
}

function language_for_id(id, language_list) {
  for (let i = 0; i < language_list.length; i++) {
    if (language_list[i].code === id) {
      return language_list[i].name;
    }
  }
}
