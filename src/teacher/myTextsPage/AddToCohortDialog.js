import React, { useState, useEffect, useContext, useMemo } from "react";
import strings from "../../i18n/definitions";
import SelectButton from "../sharedComponents/SelectButton";
import FilterInput from "../sharedComponents/FilterInput";
import { StyledDialog } from "../styledComponents/StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "../styledComponents/TeacherButtons.sc";
import { APIContext } from "../../contexts/APIContext";
import * as s from "./AddToCohortDialog.sc";

// Below this many classes the whole list is scannable at a glance and a filter
// box is just clutter. Above it, typing is the only way in: our heaviest
// teacher owns 96 classes.
const CLASSES_WORTH_FILTERING = 8;

/**
 * Classes this text is already shared with first, then the ones most recently
 * shared with anything, then the rest alphabetically.
 *
 * Most classes of a long-lived teacher account are dormant, so creation order
 * — what the API returns — buries the handful that are actually in use. An API
 * that does not yet send last_shared_time simply degrades to alphabetical.
 */
export function byRelevance(cohorts, alreadySharedWith) {
  const rankOf = (cohort) => {
    if (alreadySharedWith.includes(cohort.name)) return 0;
    return cohort.last_shared_time ? 1 : 2;
  };

  return [...cohorts].sort((a, b) => {
    const rank = rankOf(a);
    if (rank !== rankOf(b)) return rank - rankOf(b);
    if (rank === 1) return Date.parse(b.last_shared_time) - Date.parse(a.last_shared_time);
    return a.name.localeCompare(b.name);
  });
}

export default function AddToCohortDialog({ articleID, setIsOpen, onCohortsUpdated }) {
  const api = useContext(APIContext);
  const [cohortsToChoose, setCohortsToChoose] = useState(null);
  const [initiallyChosen, setInitiallyChosen] = useState(null);
  const [chosenCohorts, setChosenCohorts] = useState([]);
  const [filter, setFilter] = useState("");

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

  // Both fetches have to be in before we can order the list; ordering it
  // twice would shuffle the buttons under the teacher's cursor.
  const isLoaded = cohortsToChoose !== null && initiallyChosen !== null;

  // Deliberately keyed on the *initial* selection, not the current one: a
  // class must not jump to the top of the list the moment it is ticked.
  const orderedCohorts = useMemo(
    () => (isLoaded ? byRelevance(cohortsToChoose, initiallyChosen) : []),
    [isLoaded, cohortsToChoose, initiallyChosen],
  );

  const needle = filter.trim().toLowerCase();
  const visibleCohorts = needle
    ? orderedCohorts.filter((cohort) => cohort.name.toLowerCase().includes(needle))
    : orderedCohorts;

  // The dialog tracks selection by name (that is what SelectButton hands back);
  // callers get {id, name} because they need the id to unshare.
  const asCohortObjects = (names) =>
    names.map((name) => {
      const cohort = cohortsToChoose.find((each) => each.name === name);
      return { id: cohort ? cohort.id : name, name };
    });

  const handleChange = (cohort_name) => {
    const cohort = cohortsToChoose.find((c) => c.name === cohort_name);

    //adding a cohort to the list
    if (!chosenCohorts.includes(cohort_name)) {
      var temp = [...chosenCohorts, cohort_name];
      setChosenCohorts(temp);
      if (cohort) {
        addArticleToCohort(cohort.id);
      }
      if (onCohortsUpdated) {
        onCohortsUpdated(asCohortObjects(temp));
      }
    }
    //taking a cohort off the list
    else if (chosenCohorts.includes(cohort_name)) {
      const temp = chosenCohorts.filter((chosenCohort) => chosenCohort !== cohort_name);
      setChosenCohorts(temp);
      if (cohort) {
        deleteArticleFromCohort(cohort.id);
      }
      if (onCohortsUpdated) {
        onCohortsUpdated(asCohortObjects(temp));
      }
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
    <StyledDialog aria-label="Choose classes" onDismiss={() => setIsOpen(false)} max_width="525px">
      <h1>{strings.chooseClass}</h1>
      {isLoaded && cohortsToChoose.length > CLASSES_WORTH_FILTERING && (
        <FilterInput value={filter} onChange={setFilter} placeholder={strings.filterClassesByName} />
      )}
      <s.CohortList>
        {visibleCohorts.map((cohort) => (
          <SelectButton
            key={cohort.id}
            value={cohort.name}
            btnText={cohort.name}
            isChosen={isChosen(cohort)}
            handleChange={handleChange}
          />
        ))}
      </s.CohortList>
      {isLoaded && needle && visibleCohorts.length === 0 && <s.NoMatches>{strings.noClassesMatchFilter}</s.NoMatches>}
      <PopupButtonWrapper>
        <StyledButton $secondary onClick={() => setIsOpen(false)}>
          Close
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
