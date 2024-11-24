import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { useEffect, useState, useContext } from "react";
import strings from "../../i18n/definitions";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import { PRACTICE_DAYS } from "../../assorted/practiceDays";
import { MINUTES_GOAL } from "../../assorted/minutesGoal";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LocalStorage from "../../assorted/LocalStorage";
import LoadingAnimation from "../../components/LoadingAnimation";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";

export default function MyWeeklyGoal({ api }) {
  const [userDetails, setUserDetails] = useState(null);

  const user = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    setTitle(strings.myWeeklyGoal);
  }, []);

  useEffect(() => {
    api.getUserCommitment((commitmentData) => {
      setUserDetails(commitmentData);
    });
  }, []);

  function updateCommitmentInto() {
    saveUserInfoIntoCookies();
  }

  function updatePracticeDays() {}

  function updateMinutes() {}

  function handleSave() {}

  if (!userDetails) {
    return <LoadingAnimation />;
  }

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.myWeeklyGoal}</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            <Selector
              id={"practice-goal-selector"}
              options={PRACTICE_DAYS}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myPracticeGoal}
              selected={userDetails ? userDetails.user_days : 0}
            />
          </FormSection>
          <FormSection>
            <Selector
              id={"minutes-goal-selector"}
              options={MINUTES_GOAL}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myDurationGoal}
              selected={userDetails ? userDetails.user_minutes : 0}
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"}>{strings.save}</Button>
          </ButtonContainer>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
