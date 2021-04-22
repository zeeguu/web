import React, { useState, useEffect } from "react";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

export default function AddToCohortDialog({ api, setIsOpen, setCohorts }) {
  const [cohortsToChoose, setCohortsToChoose] = useState([]);
  var [chosenCohorts, setChosenCohorts] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    api.getCohortsInfo((res) => {
      setCohortsToChoose(res);
    });
    setForceUpdate((prev) => prev + 1);
    // eslint-disable-next-line
  }, []);
  //TODO fix hardcoded languages in LanguageSelector
  api.getSystemLanguages((res)=>console.log(res));

  const handleChange = (cohort) => {
      //TODO we need a conditional here if (chosenCohorts.includes(cohort){//deselect}else{//select}
    console.log(cohort);
    var temp = new Array (...chosenCohorts, cohort)
    setChosenCohorts(temp);
    setForceUpdate((prev) => prev + 1);
  };

  const handleSubmit = () => {
    /* setCohorts(chosenCohorts);
      setIsOpen(false); */
    console.log(chosenCohorts);
  };

  return (
    <StyledDialog
      aria-label="Choose cohorts"
      onDismiss={() => setIsOpen(false)}
      max_width="525px"
    >
      <h1>Choose one or more classes STRING</h1>
      {forceUpdate > 0 &&
        cohortsToChoose.map((cohort) => (
          <StyledButton
            choiceNotSelected
            onClick={() => {handleChange(cohort)}}
          >
            {cohort.name}
          </StyledButton>
        ))}
      <PopupButtonWrapper>
        <StyledButton primary onClick={handleSubmit}>
          Add to class STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
