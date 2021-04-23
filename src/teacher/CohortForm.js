import React, { useState } from "react";
import { FormControl } from "@material-ui/core";
import LoadingAnimation from "../components/LoadingAnimation";
import { Error } from "./Error";
import {
  CohortNameTextfield,
  InviteCodeTextfield,
} from "./CohortFormInputFields";
import { languageMap, LanguageSelector } from "./LanguageSelector";
import { StyledButton, PopupButtonWrapper } from "./TeacherButtons.sc";
import { StyledDialog } from "./StyledDialog.sc";
import CohortItemCard from "./CohortItemCard";

const CohortForm = ({ api, cohort, setForceUpdate, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [state, setState] = useState({
    id: cohort ? cohort.id : "",
    cohort_name: cohort ? cohort.name : "",
    invite_code: cohort ? cohort.inv_code : "",
    language_code: cohort ? languageMap[cohort.language_name] : "default",
    max_students: 150, //some teachers create one joint class for all the students of an entire year //TODO modify backend etc. to no longer include this...
  });

  const addCohort = (form) => {
    setIsError(false);
    api
      .createCohort(form)
      .then((result) => {
        setIsOpen(false);
        //TODO add system feedback to user here
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
        //TODO add system feedback to user here
        setIsError(true);
      });
  };

  //!A CONFIRMATION POPUP SHOULD OPEN BEFORE THIS IS ACTUALLY RUN!!!
  //!Remember that it is not possible to delete a class with students in it.
  const deleteCohort = (cohort_id) => {
    setIsLoading(true);
    setIsError(false);
    api
      .deleteCohort(cohort_id)
      .then((result) => {
        setIsOpen(false);
        //TODO add system feedback to user here
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
        //TODO add system feedback to user here
        setIsError(true);
      });
    setIsLoading(false);
  };

  const updateCohort = (form, cohort_id) => {
    setIsError(false);
    api
      .updateCohort(form, cohort_id)
      .then((result) => {
        setIsOpen(false);
        //TODO add system feedback to user here
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
        //TODO add system feedback to user here
        setIsError(true);
      });
    setIsLoading(false);
  };

  function handleChange(event) {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  }

  //The LanguageSelector component returns the language selected by the user as a string (not an event like the other input fields)
  function handleLanguageChange(selectedLanguage) {
    setState({
      ...state,
      language_code: selectedLanguage,
    });
  }
  //! There is no form validation so the user can upload classes with data missing!!! Validation should be implented.
  function setupForm() {
    const form = new FormData();
    form.append("name", state.cohort_name);
    form.append("inv_code", state.invite_code);
    form.append("max_students", state.max_students); //TODO modify backend etc. to no longer include this...
    form.append("language_code", state.language_code);
    return form;
  }

  function submitForm(event) {
    setIsLoading(true);
    const form = setupForm();
    cohort ? updateCohort(form, cohort.id) : addCohort(form);
    event.preventDefault();
    setIsLoading(false);
  }

  return (
    <div>
      {cohort ? <h1>Edit Class STRINGS</h1> : <h1>Create Class STRINGS</h1>}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <form>
          <CohortNameTextfield
            value={state.cohort_name}
            onChange={handleChange}
          />
          <InviteCodeTextfield
            value={state.invite_code}
            onChange={handleChange}
          />
          <FormControl
            fullWidth
            disabled={!!cohort}
            required
            style={{ minWidth: 120 }}
          >
            <LanguageSelector
              value={state.language_code}
              onChange={handleLanguageChange}
            >
              Classroom language STRINGS
            </LanguageSelector>
          </FormControl>
          {isError && (
            <Error
              message={
                "Something went wrong. Maybe the invite code is already in use. DEV NOTE: Cannot delete class with texts in it. STRINGS"
              }
              setLoading={setIsLoading}
            />
          )}
        </form>
      )}
      <PopupButtonWrapper>
        <StyledButton primary onClick={submitForm} style={{ minWidth: 120 }}>
          {cohort ? "Save changes STRINGS" : "Create class STRINGS"}
        </StyledButton>
        {cohort && (
          <StyledButton secondary onClick={() => setShowWarning(true)}>
            DeleteSTRING
          </StyledButton>
        )}
      </PopupButtonWrapper>
      {showWarning && (
        <StyledDialog
          aria-label="Delete a class warning"
          onDismiss={() => setShowWarning(false)}
          max_width="525px"
        >
          <h1>Danger Zone STRINGS</h1>
          <p>
            Are you sure you want to delete this class? This cannot be undone.
            STRINGS
          </p>
          <CohortItemCard
            api={api}
            cohort={cohort}
            setForceUpdate={() => console.log("This is never used")}
            isWarning={true}
          />
          <PopupButtonWrapper>
            <StyledButton primary onClick={() => setShowWarning(false)}>
              Cancel STRINGS
            </StyledButton>
            <StyledButton secondary onClick={() => deleteCohort(cohort.id)}>
              Delete STRINGS
            </StyledButton>
          </PopupButtonWrapper>
        </StyledDialog>
      )}
    </div>
  );
};

export default CohortForm;
