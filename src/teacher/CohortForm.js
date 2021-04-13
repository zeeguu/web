import React, { useState } from "react";
import { FormControl } from "@material-ui/core";
import { SpringSpinner } from "react-epic-spinners";
import { Error } from "./Error";
//import { DangerZone } from "./DangerZone";
import {
  languageMap,
  LanguageSelector,
  CohortNameTextfield,
  InviteCodeTextfield,
} from "./CohortFormInputFields";

import { StyledButton } from "./TeacherButtons.sc";

const CohortForm = ({ cohort, isError, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useState({
    id: cohort ? cohort.id : "",
    cohort_name: cohort ? cohort.name : "",
    invite_code: cohort ? cohort.inv_code : "",
    language_id: cohort ? languageMap[cohort.language_name] : "es",
    max_students: 150, //some teachers create one joint class for all the students of an entire year //TODO modify backend etc. to no longer include this...
  });

  function handleChange(event) {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  }

  function handleLanguageChange(selectedLanguage) {
    setState({
      ...state,
      language_id: selectedLanguage,
    });
  }

  function setupForm() {
    const form = new FormData();
    form.append("name", state.cohort_name);
    form.append("inv_code", state.invite_code);
    form.append("max_students", state.max_students); //TODO modify backend etc. to no longer include this...
    form.append("language_id", state.language_id);
    return form;
  }

  function submitForm(event) {
    setIsLoading(true);
    const form = setupForm();
    onSubmit(form);
    event.preventDefault();
    setIsLoading(false);
  }

  return (
    <div>
      <h1>Create Class STRINGS</h1>
      <form onSubmit={submitForm} style={{ display: "flex", flexWrap: "wrap" }}>
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
            value={state.language_id}
            onChange={handleLanguageChange}
          />
        </FormControl>
        {isError && (
          <Error
            message={
              "Something went wrong. Maybe the invite code is already in use."
            }
            setLoading={setIsLoading}
          />
        )}
        <StyledButton primary type="submit" style={{ minWidth: 120 }}>
          {isLoading ? <SpringSpinner size={18} /> : "Create class STRINGS"}
        </StyledButton>
      </form>
      {/* {cohort && <DangerZone cohortId={cohort.id} />} */}
    </div>
  );
};

export default CohortForm;
