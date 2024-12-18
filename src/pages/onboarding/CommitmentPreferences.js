import { useState, useEffect} from "react";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import { scrollToTop } from "../../utils/misc/scrollToTop";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import { isSupportedBrowser } from "../../utils/misc/browserDetection";
import strings from "../../i18n/definitions";
import { PRACTICE_DAYS } from "../../assorted/practiceDays";
import { MINUTES_GOAL_INTRO } from "../../assorted/minutesGoal";
import { useHistory } from "react-router-dom";
import validator from "../../assorted/validator";

export default function CommitmentPreferences({ api, hasExtension }) {
  const [userDetails, setUserDetails] = useState({
    user_minutes: "",
    user_days: "",
  });
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      scrollToTop();
    }
  }, [errorMessage]);

  function saveCommitmentInfo(info) {
    setUserDetails({
      user_minutes: info.user_minutes,
      user_days: info.user_days,
    });
  }

  function savePracticeDays(practiceDays) {
    setUserDetails({ ...userDetails, user_days: practiceDays });
  }

  function saveMinutes(minutes) {
    setUserDetails({ ...userDetails, user_minutes: minutes });
  }

  let validatorRules = [
    [
      userDetails.user_days === "",
      "Please select how many days you want to practice",
    ],
    [
      userDetails.user_minutes === "",
     "Please select how many days you want to practice",
    ],
  ];

  function handleCommitmentPreferences(e) {
    e.preventDefault();
    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }
    api.createUserCommitment(userDetails, () => {
      saveCommitmentInfo(userDetails);
      const nextPage = getLinkToNextPage();
      history.push(nextPage);
    });
  }

  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>{strings.timeCommitment}</Heading>
      </Header>
      <Main>
        <Form>
        {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <Selector
              id={"practice-goal-initialiser"}
              options={PRACTICE_DAYS}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myPracticeGoal}
              selectedValue={userDetails.user_days}
              onChange={(e) => {
                savePracticeDays(e.target.value);
              }}
              placeholder={strings.selectDays}
            />
            <Selector
              id={"minutes-goal-initialiser"}
              options={MINUTES_GOAL_INTRO}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myDurationGoal}
              selectedValue={userDetails.user_minutes}
              onChange={(e) => {
                saveMinutes(e.target.value);
              }}
              placeholder={strings.selectMinutes}
            />
          </FormSection>
          <p className="centered">{strings.youCanChangeInSettings}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={handleCommitmentPreferences}
            >
              {strings.next} <RoundedForwardArrow />
            </Button>
          </ButtonContainer>
          <p className="centered">
            {strings.alreadyHaveAccount + " "}
            <a className="bold underlined-link" href="/log_in">
              {strings.login}
            </a>
          </p>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
