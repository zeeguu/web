import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import LocalStorage from "../../assorted/LocalStorage";
import strings from "../../i18n/definitions";
import Form from "../info_page_shared/Form";
import FormSection from "../info_page_shared/FormSection";
import Button from "../info_page_shared/Button";
import ButtonContainer from "../info_page_shared/ButtonContainer";
import InputField from "../info_page_shared/InputField";
import InfoPage from "../info_page_shared/InfoPage";
import Main from "../info_page_shared/Main";
import BackArrow from "../settings_pages_shared/BackArrow";
import FullWidthErrorMsg from "../info_page_shared/FullWidthErrorMsg";

import { PageTitle } from "../../components/PageTitle";

import LoadingAnimation from "../../components/LoadingAnimation";

export default function ProfileDetails({ api, setUser }) {
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cefr, setCEFR] = useState("");

  const user = useContext(UserContext);
  const history = useHistory();

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
      history.goBack();
    });
  }

  if (!userDetails) {
    return <LoadingAnimation />;
  }

  return (
    <InfoPage pageLocation={"settings"}>
      <BackArrow />
      <PageTitle>{strings.profileDetails}</PageTitle>
      <Main>
        <Form>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <InputField
              type={"text"}
              label={strings.name}
              id={"name"}
              name={"name"}
              placeholder={strings.name}
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
            />
            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              placeholder={strings.email}
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
          </FormSection>
          <ButtonContainer>
            <Button onClick={handleSave}>{strings.save}</Button>
          </ButtonContainer>
        </Form>
      </Main>
    </InfoPage>
  );
}
