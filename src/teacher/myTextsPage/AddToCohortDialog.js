import React, { useState, useEffect, useContext } from "react";
import strings from "../../i18n/definitions";
import { useParams } from "react-router";
import SelectButton from "../sharedComponents/SelectButton";
import { StyledDialog } from "../styledComponents/StyledDialog.sc";
import {
  PopupButtonWrapper,
  StyledButton,
} from "../styledComponents/TeacherButtons.sc";
import { APIContext } from "../../contexts/APIContext";

export default function AddToCohortDialog({ setIsOpen }) {
  const api = useContext(APIContext);
  const [cohortsToChoose, setCohortsToChoose] = useState([]);
  const [initiallyChosen, setInitiallyChosen] = useState([]);
  const [chosenCohorts, setChosenCohorts] = useState([]);
  const articleID = useParams().articleID;

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
        (chosenCohort) => chosenCohort !== cohort_name,
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
      },
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
      },
    );
  };

  const isChosen = (cohort) => chosenCohorts.includes(cohort.name);

  return (
    <StyledDialog
      aria-label="Choose classes"
      onDismiss={() => setIsOpen(false)}
      max_width="525px"
    >
      <h1>{strings.chooseClass}</h1>
      {chosenCohorts.length >= 0 &&
        cohortsToChoose.map((cohort) => (
          <SelectButton
            key={cohort.id}
            value={cohort.name}
            btnText={cohort.name}
            isChosen={isChosen(cohort)}
            handleChange={handleChange}
          />
        ))}
      <PopupButtonWrapper>
        <StyledButton primary onClick={addToCohorts}>
          {strings.saveChanges}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
