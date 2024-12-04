import { useState, useEffect } from "react";
import { scrollToTop } from "../../utils/misc/scrollToTop";
import redirect from "../../utils/routing/routing";
import useFormField from "../../hooks/useFormField";

import PreferencesPage from "../_pages_shared/PreferencesPage";
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

import validator from "../../assorted/validator";
import strings from "../../i18n/definitions";
import LoadingAnimation from "../../components/LoadingAnimation";
import { PRACTICE_DAYS } from "../../assorted/practiceDays";
import { MINUTES_GOAL_INTRO } from "../../assorted/minutesGoal";

export default function CommitmentPreferences({ api }) {
  const [practice_days_on_register, handlePractice_days_on_register] =
    useFormField(""); 
  const [mins_goal_on_register, handleMins_goal_on_register] = useFormField("");
  const [systemLanguages] = useState(" ");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      scrollToTop();
    }
  }, [errorMessage]);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }

  let validatorRules = [
    [
      practice_days_on_register === "",
      "Please select how many days per week you want to practice",
    ],
    [
      mins_goal_on_register === "",
      "Please select how many minutes per session you want to practice",
    ],
  ];

  function validateAndRedirect(e) {
    e.preventDefault();
    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }
    redirect("/create_account");
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>How much time would you like to commit to per week?</Heading>
      </Header>
      <Main>
        <Form action={""}>
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
              selectedValue={practice_days_on_register}
              onChange={handlePractice_days_on_register}
              placeholder = {"5 days is recommended."}
            />

            <Selector
              id={"minutes-goal-initialiser"}
              options={MINUTES_GOAL_INTRO}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myDurationGoal}
              selectedValue={mins_goal_on_register}
              onChange={handleMins_goal_on_register}
              placeholder= {"5 minutes is recommended."}
            />
          </FormSection>
          <p className="centered">{strings.youCanChangeLater}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={validateAndRedirect}
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
