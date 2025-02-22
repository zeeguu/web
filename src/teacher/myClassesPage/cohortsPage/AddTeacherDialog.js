import React, { useContext, useEffect, useState } from "react";
import strings from "../../../i18n/definitions";
import { LabeledTextField } from "../../sharedComponents/LabeledInputFields";
import * as s from "../../styledComponents/AddURLDialog.sc";
import {
  PopupButtonWrapper,
  StyledButton,
} from "../../styledComponents/TeacherButtons.sc";
import { Error } from "../../sharedComponents/Error";
import { StyledDialog } from "../../styledComponents/StyledDialog.sc";
import { APIContext } from "../../../contexts/APIContext";

export default function AddTeacherDialog({
  cohort,
  setIsOpen,
  setForceUpdate,
}) {
  const api = useContext(APIContext);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showError, setShowError] = useState(false);
  const [colleagueEmail, setColleagueEmail] = useState("");

  useEffect(() => {
    if (colleagueEmail !== "") {
      setShowGuidance(false);
    }
    setShowError(false);
  }, [colleagueEmail]);

  function handleChange(event) {
    setColleagueEmail(event.target.value);
  }

  function handleSuccess() {
    setForceUpdate((prev) => prev + 1);
    setIsOpen(false);
  }

  const shareWithColleague = () => {
    if (colleagueEmail === "") {
      setShowGuidance(true);
    } else {
      api.addColleagueToCohort(
        cohort.id,
        colleagueEmail,
        (success) => {
          console.log("Succeeded!!!");
          console.log(success);
          success === "OK" ? handleSuccess() : setShowError(true);
        },
        (error) => {
          console.log(error);
          setShowError(true);
        },
      );
    }
  };

  return (
    <StyledDialog
      aria-label={strings.addTextFromWebpage}
      onDismiss={() => setIsOpen(false)}
      max_width="525px"
    >
      <s.StyledURLDialog>
        <h1 className="add-text-headline">
          {strings.addAnotherTeacherToTheClass}
        </h1>
      </s.StyledURLDialog>
      <LabeledTextField
        value={colleagueEmail}
        onChange={handleChange}
        name="colleague_email"
        placeholder={strings.colleagueEmailExample}
      >
        {strings.addEmailOfColleague}
      </LabeledTextField>
      <p>
        <b>{strings.pleaseNote}</b>
        {strings.addTeacherWarningPartOne}
      </p>
      <Error message={strings.addTeacherWarningPartTwo} />
      {showGuidance && <Error message={strings.youHaveToAddEmail} />}
      {showError && <Error message={strings.errorMSg} />}
      <PopupButtonWrapper>
        <StyledButton primary onClick={shareWithColleague}>
          {strings.addColleague}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
