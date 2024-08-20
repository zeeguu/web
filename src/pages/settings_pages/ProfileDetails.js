import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import LocalStorage from "../../assorted/LocalStorage";
import strings from "../../i18n/definitions";
import Button from "../info_page_shared/Button";
import ButtonContainer from "../info_page_shared/ButtonContainer";

import LoadingAnimation from "../../components/LoadingAnimation";

import * as s from "../../components/FormPage.sc";
import * as scs from "../Settings.sc";

export default function ProfileDetails({ api, setUser }) {
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cefr, setCEFR] = useState("");

  const user = useContext(UserContext);

  useEffect(() => {
    api.getUserDetails((data) => {
      setUserDetails(data);
      setCEFRlevel(data);
    });
  }, [user.session, api]);

  function setCEFRlevel(data) {
    const levelKey = data.learned_language + "_cefr_level";
    const levelNumber = data[levelKey];
    setCEFR("" + levelNumber);
    setUserDetails({
      ...data,
      cefr_level: levelNumber,
    });
  }

  function updateUserInfo(info) {
    LocalStorage.setUserInfo(info);
    setUser({
      ...user,
      name: info.name,
    });

    saveUserInfoIntoCookies(info);
  }

  function handleSave(e) {
    e.preventDefault();
    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails);
      //   if (history.length > 1) {
      //     history.goBack();
      //   } else {
      //     window.close();
      //   }
    });
  }

  if (!userDetails) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>{" "}
      Profile Details
      <s.FormContainer>
        <scs.StyledSettings>
          <form className="formSettings">
            <h5>{errorMessage}</h5>
            <b>Profile Details</b>
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
            <ButtonContainer>
              <Button onClick={handleSave}>{strings.save}</Button>
            </ButtonContainer>
          </form>
        </scs.StyledSettings>
      </s.FormContainer>
    </div>
  );
}
