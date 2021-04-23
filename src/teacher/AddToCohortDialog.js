import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

export default function AddToCohortDialog({ api, setIsOpen }) {
  const [cohortsToChoose, setCohortsToChoose] = useState([]);
  var [chosenCohorts, setChosenCohorts] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const articleID = useParams().articleID;
  const history = useHistory();
  //TODO set the chosen cohorts to any cohorts already "in" the article
  useEffect(() => {
    api.getCohortsInfo((cohortsOfTeacher) => {
      setCohortsToChoose(cohortsOfTeacher);
    });
    api.getCohortFromArticle(articleID, (cohortsInArticle) => {
      console.log("cohortsInArticle:");
      console.log(cohortsInArticle);
      setChosenCohorts(cohortsInArticle);
    });

    setForceUpdate((prev) => prev + 1);
    // eslint-disable-next-line
  }, []);

  const addToCohorts = () => {
    chosenCohorts.forEach((cohort) => {
      console.log("Adding " + articleID + " to " + cohort.id);
      addArticleToCohort(cohort.id);
      setIsOpen(false);
    });
  };

  const handleChange = (cohort) => {
    //TODO we need a conditional here if (chosenCohorts.includes(cohort){//deselect}else{//select}
    console.log(cohort);
    if (!chosenCohorts.includes(cohort)) {
      var temp = [...chosenCohorts, cohort];
      setChosenCohorts(temp);
      setForceUpdate((prev) => prev + 1);
    }
  };

  const addArticleToCohort = (cohortID) => {
    api.addArticleToCohort(
      articleID,
      cohortID,
      (res) => {
        console.log("Connection established...");
        console.log(res);
        history.push("/teacher/texts");
      },
      () => {
        console.log("Connection to server failed...");
      }
    );
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
            key={cohort.id}
            choiceSelected
            onClick={() => {
              handleChange(cohort);
            }}
          >
            {cohort.name}
          </StyledButton>
        ))}
      <PopupButtonWrapper>
        <StyledButton primary onClick={addToCohorts}>
          Add to class STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
