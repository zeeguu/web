import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import SelectCohortsButton from "./SelectCohortsButton";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

export default function AddToCohortDialog({ api, setIsOpen }) {
  const [cohortsToChoose, setCohortsToChoose] = useState([]);
  const [initiallyChosen, setInitiallyChosen] = useState([]);
  const [chosenCohorts, setChosenCohorts] = useState([]);
  const articleID = useParams().articleID;
  const history = useHistory();

  useEffect(() => {
    api.getCohortsInfo((cohortsOfTeacher) => {
      setCohortsToChoose(cohortsOfTeacher);
    });
    api.getCohortFromArticle(articleID, (cohortsInArticle) => {
      setChosenCohorts(cohortsInArticle);
      setInitiallyChosen(cohortsInArticle);
    });
    // eslint-disable-next-line
  }, []);

  const addToCohorts = () => {
    cohortsToChoose.forEach((cohort) => {
      if (isChosen(cohort) === true) {
        addArticleToCohort(cohort.id);
      } else if (initiallyChosen.includes(cohort.name)) {
        deleteArticleFromCohort(cohort.id);
      }
      setIsOpen(false);
      history.push("/teacher/texts");
    });
  };

  const handleChange = (cohort_name) => {
    //adding a cohort to the list
    if (!chosenCohorts.includes(cohort_name)) {
      var temp = [...chosenCohorts, cohort_name];
      setChosenCohorts(temp);
    }
    //taking a cohort off the list
    if (chosenCohorts.includes(cohort_name)) {
      const temp = chosenCohorts.filter(
        (chosenCohort) => chosenCohort !== cohort_name
      );
      setChosenCohorts(temp);
    }
  };

  const addArticleToCohort = (cohortID) => {
    api.addArticleToCohort(
      articleID,
      cohortID,
      (res) => {
        console.log("Add article to cohort - status: " + res);
      },
      () => {
        console.log("Connection to server failed...");
      }
    );
  };

  const deleteArticleFromCohort = (cohortID) => {
    api.deleteArticleFromCohort(
      articleID,
      cohortID,
      (res) => {
        console.log("Delete article from cohort - status: " + res);
      },
      () => {
        console.log("Connection to server failed...");
      }
    );
  };

  const isChosen = (cohort) => chosenCohorts.includes(cohort.name);

  return (
    <StyledDialog
      aria-label="Choose classes"
      onDismiss={() => setIsOpen(false)}
      max_width="525px"
    >
      <h1>Choose one or more classes STRING</h1>
      {chosenCohorts.length >= 0 &&
        cohortsToChoose.map((cohort) => (
          <SelectCohortsButton
            key={cohort.id}
            cohort={cohort}
            isChosen={isChosen(cohort)}
            handleChange={handleChange}
          />
        ))}
      <PopupButtonWrapper>
        <StyledButton primary onClick={addToCohorts}>
          Save changes STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
