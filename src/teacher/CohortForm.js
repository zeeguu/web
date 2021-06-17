import React, { useState } from "react";
import strings from "../i18n/definitions";
import { FormControl } from "@material-ui/core";
import LoadingAnimation from "../components/LoadingAnimation";
import { Error } from "./Error";
import {
  CohortNameTextField,
  InviteCodeTextField,
} from "./CohortFormInputFields";
import { languageMap, LanguageSelector } from "./LanguageSelector";
import { StyledButton, PopupButtonWrapper } from "./TeacherButtons.sc";
import DeleteCohortWarning from "./DeleteCohortWarning";
import { StyledDialog } from "./StyledDialog.sc";

const CohortForm = ({ api, cohort, setForceUpdate, setShowCohortForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [state, setState] = useState({
    id: cohort ? cohort.id : "",
    cohort_name: cohort ? cohort.name : "",
    invite_code: cohort ? cohort.inv_code : "",
    language_code: cohort ? languageMap[cohort.language_name] : "default",
    max_students: 150, //some teachers create one joint class for all the students of an entire year //TODO modify backend etc. to no longer include this...
  });

  const addCohort = (form) => {
    setIsLoading(true);
    setIsError(false);
    api
      .createCohort(form)
      .then((result) => {
        setShowCohortForm(false);
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
        setIsError(true);
      });
    setIsLoading(false);
  };

  const deleteCohort = (cohort_id) => {
    setIsLoading(true);
    setIsDeleteError(false);
    api
      .deleteCohort(cohort_id)
      .then((result) => {
        setShowCohortForm(false);
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
        setIsDeleteError(true);
      });
    setIsLoading(false);
  };

  const updateCohort = (form, cohort_id) => {
    setIsLoading(true);
    setIsError(false);
    api
      .updateCohort(form, cohort_id)
      .then((result) => {
        setShowCohortForm(false);
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
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

  const inputIsEmpty =
    state.cohort_name === "" ||
    state.invite_code === "" ||
    state.language_code === "default";

  //the submit button is disabled until the input is valid
  const isValid =
    !inputIsEmpty &&
    state.cohort_name.length <= 20 &&
    state.invite_code.length <= 20;

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
    <StyledDialog
      onDismiss={() => setShowCohortForm(false)}
      aria-label="Create class"
      max_width="525px"
    >
      {cohort ? <h1>{strings.editClass}</h1> : <h1>{strings.createClass}</h1>}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <form>
          <CohortNameTextField
            value={state.cohort_name}
            onChange={handleChange}
          />
          <InviteCodeTextField
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
              api={api}
              value={state.language_code}
              onChange={handleLanguageChange}
            >
              {strings.classroomLanguage}
            </LanguageSelector>
          </FormControl>
          {isError && <Error message={strings.errorInviteCode} />}
        </form>
      )}
      {inputIsEmpty && <Error message={strings.errorEmptyInputField} />}
      <PopupButtonWrapper>
        <StyledButton
          primary
          onClick={submitForm}
          style={{ minWidth: 120 }}
          disabled={!isValid}
        >
          {cohort ? strings.saveChanges : strings.createClass}
        </StyledButton>
        {cohort && (
          <StyledButton secondary onClick={() => setShowWarning(true)}>
            {strings.deleteFromMyClasses}
          </StyledButton>
        )}
      </PopupButtonWrapper>
      {showWarning && (
        <DeleteCohortWarning
          api={api}
          cohort={cohort}
          setShowWarning={setShowWarning}
          deleteCohort={deleteCohort}
          isDeleteError={isDeleteError}
          setIsDeleteError={setIsDeleteError}
          setIsLoading={setIsLoading}
        />
      )}
    </StyledDialog>
  );
};

export default CohortForm;
