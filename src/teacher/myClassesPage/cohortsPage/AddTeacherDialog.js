import React, { useEffect, useState } from "react";
import strings from "../../../i18n/definitions";
import { LabeledTextField } from "../../sharedComponents/LabeledInputFields";
import * as s from "../../styledComponents/AddURLDialog.sc";
import {
  PopupButtonWrapper,
  StyledButton,
} from "../../styledComponents/TeacherButtons.sc";
import { Error } from "../../sharedComponents/Error";
import { StyledDialog } from "../../styledComponents/StyledDialog.sc";

export default function AddTeacherDialog({
  api,
  cohort,
  setIsOpen,
  setForceUpdate,
}) {
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
        }
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
          ADD ANOTHER TEACHER TO THE CLASS***
        </h1>
      </s.StyledURLDialog>
      <LabeledTextField
        value={colleagueEmail}
        onChange={handleChange}
        name="colleague_email"
        placeholder="eg. 'COLLEAGUE@WORKMAIL.COM'"
      >
        ADD EMAIL OF COLLEAGUE***
      </LabeledTextField>
      <p>
        ***<b>{strings.pleaseNote}</b>
        This adds the class to your colleague's list of classes. If you delete
        the class, you also irriversibly delete the class from your colleagues
        list of classes.***
      </p>
      {showGuidance && (
        <Error message="YOU HAVE TO ADD THE EMAIL OF A TEACHER." />
      )}
      {showError && (
        <Error message="SOMETHING WENT WRONG. IT CAN BE THAT THE EMAIL IS NOT MATCHING ANYONE IN THE SYSTEM OR A SERVER ERROR. FEEL FREE TO CONTACT US IF THE ERROR PERSISTS." />
      )}
      <PopupButtonWrapper>
        <StyledButton primary onClick={shareWithColleague}>
          ADD COLLEAGUE***
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
