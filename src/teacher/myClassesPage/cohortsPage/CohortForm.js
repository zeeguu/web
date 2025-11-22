import React, { useContext, useState } from "react";
import strings from "../../../i18n/definitions";
import { FormControl } from "@mui/material";
import LoadingAnimation from "../../../components/LoadingAnimation";
import { Error } from "../../sharedComponents/Error";
import { toast } from "react-toastify";
import {
  CohortNameTextField,
  InviteCodeTextField,
} from "./CohortFormInputFields";
import {
  languageMap,
  LanguageSelector,
} from "../../sharedComponents/LanguageSelector";
import {
  StyledButton,
  PopupButtonWrapper,
} from "../../styledComponents/TeacherButtons.sc";
import DeleteCohortWarning from "./DeleteCohortWarning";
import { StyledDialog } from "../../styledComponents/StyledDialog.sc";
import * as s from "../../styledComponents/CohortForm.sc";
import { APIContext } from "../../../contexts/APIContext";

const CohortForm = ({ cohort, setForceUpdate, setShowCohortForm, cohorts }) => {
  const api = useContext(APIContext);
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
        toast.success("Class deleted successfully!");
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

  const invalidClassName = () => {
    const invalid = cohorts.filter(
      (cohort) => cohort.name === state.cohort_name,
    );
    return invalid.length > 0;
  };

  const invalidInviteCode = () => {
    const invalid = cohorts.filter(
      (cohort) => cohort.inv_code === state.invite_code,
    );
    return invalid.length > 0;
  };

  //the submit button is disabled until the input is valid
  const isValid = cohort
    ? !inputIsEmpty &&
      state.cohort_name.length <= 20 &&
      state.invite_code.length <= 20
    : !inputIsEmpty &&
      state.cohort_name.length <= 20 &&
      !invalidClassName() &&
      state.invite_code.length <= 20 &&
      !invalidInviteCode();

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
    <s.StyledCohortForm>
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
            {invalidClassName() && !cohort && (
              <Error message="You already have a class with that name" />
            )}
            <InviteCodeTextField
              value={state.invite_code}
              onChange={handleChange}
            />
            {invalidInviteCode() && !cohort && (
              <Error message="You already used that invite code for a class" />
            )}
            <FormControl
              fullWidth
              disabled={!!cohort}
              required
              className="form-control"
            >
              <LanguageSelector
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
            className="form-control"
            disabled={!isValid}
          >
            {cohort ? strings.saveChanges : strings.createClass}
          </StyledButton>
          {cohort && (
            <StyledButton secondary onClick={() => setShowWarning(true)}>
              {strings.delete}
            </StyledButton>
          )}
        </PopupButtonWrapper>
        {showWarning && (
          <DeleteCohortWarning
            cohort={cohort}
            setShowWarning={setShowWarning}
            deleteCohort={deleteCohort}
            isDeleteError={isDeleteError}
            setIsDeleteError={setIsDeleteError}
            setIsLoading={setIsLoading}
          />
        )}
      </StyledDialog>
    </s.StyledCohortForm>
  );
};

export default CohortForm;
