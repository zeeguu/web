import CohortForm from "./CohortForm";
import { CohortItemCard } from "./CohortItemCard";
import { sortCohorts } from "./cohortSort";

// The rows carry no actions any more: "Add Class" is the page header's, and
// editing a class or adding a teacher to it happens inside the class. So all
// this list still owns is the new-class form the header opens.
// sort: one of COHORT_SORTS (cohortSort.js).
export default function CohortList({ cohorts, sort, setForceUpdate, showCohortForm, setShowCohortForm }) {
  return (
    <>
      {sortCohorts(cohorts, sort).map((cohort) => (
        <CohortItemCard key={cohort.id} cohort={cohort} />
      ))}
      {showCohortForm && (
        <CohortForm
          setShowCohortForm={setShowCohortForm}
          setForceUpdate={setForceUpdate}
          cohort={null}
          cohorts={cohorts}
        />
      )}
    </>
  );
}
