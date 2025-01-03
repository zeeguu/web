import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import strings from "../../i18n/definitions";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";
import InputField from "../../components/InputField";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import { PRACTICE_DAYS } from "../../assorted/practiceDays";
import { MINUTES_GOAL } from "../../assorted/minutesGoal";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LoadingAnimation from "../../components/LoadingAnimation";

export default function MyWeeklyGoal({ api}) {


  const [userDetails, setUserDetails] = useState(null);
  const user = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    setTitle(strings.myWeeklyGoal);
  }, []);

  useEffect(() => {
    api.getUserCommitment((commitmentData) => {
      setUserDetails(commitmentData);
      console.log(commitmentData);
    });
  }, [api]);

  function updateCommitmentInfo(info) {
    setUserDetails({
      ...user,
      user_minutes: info.user_minutes,
      user_days: info.user_days,
    });
  }

  function updatePracticeDays(practiceDays) {
    setUserDetails({ ...userDetails, user_days: practiceDays });
  }

  function updateMinutes(minutes) {
    setUserDetails({ ...userDetails, user_minutes: minutes });
  }

  function handleSave(e) {
    e.preventDefault();
    api.saveUserCommitmentInfo(userDetails, () => {
      updateCommitmentInfo(userDetails);
      history.goBack();
      toast("Commitment saved!", { position: "top-right" });
    });
  }

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
              selectedValue={userDetails.user_days}
              onChange={(e) => {
                updatePracticeDays(e.target.value);
              }}
            />
          </FormSection>
          <FormSection>
            <Selector
              id={"minutes-goal-selector"}
              options={MINUTES_GOAL}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myDurationGoal}
              selectedValue={userDetails.user_minutes}
              onChange={(e) => {
                updateMinutes(e.target.value);
              }}
            />
            <InputField
              type="number"
              label="Custom minutes"
              name="minutes"
              id="minutes"
              value={userDetails.user_minutes}
              onChange={(e) => {
                updateMinutes(e.target.value);
              }}
              placeholder="Enter up to 720 minutes"
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
