import React, { useState } from "react";
import StudentInfoLine from "./StudentInfoLine";
import TimeSelector from "../../sharedComponents/TimeSelector";
import FilterInput from "../../sharedComponents/FilterInput";
import Selector from "../../../components/Selector";
import LoadingAnimation from "../../../components/LoadingAnimation";
import EmptyState from "../../../components/EmptyState";
import strings from "../../../i18n/definitions";
import { CenteredContentContainer } from "../../../components/ColumnWidth.sc";
import { ScrollableTable } from "../../styledComponents/ScrollableTable.sc";
import { FilterBar } from "../../styledComponents/TextFilterBar.sc";
import { likelyDuplicates } from "./duplicateStudents";
import { DEFAULT_STUDENT_SORT, STUDENT_SORTS, matchesSearch, sortStudents } from "./studentSort";

// One order for every class: a teacher who wants the idle students on top
// wants them on top in all of their classes.
const SORT_KEY = "teacher_student_sort";

function rememberedSort() {
  try {
    return window.localStorage.getItem(SORT_KEY) || DEFAULT_STUDENT_SORT;
  } catch {
    return DEFAULT_STUDENT_SORT; // storage blocked
  }
}

const StudentsActivityOverviewContent = ({ cohortID, students, setForceUpdate, removeStudentFromCohort }) => {
  const [sort, setSort] = useState(rememberedSort);
  const [search, setSearch] = useState("");

  if (students === null) {
    return <LoadingAnimation />;
  }

  function chooseSort(value) {
    setSort(value);
    try {
      window.localStorage.setItem(SORT_KEY, value);
    } catch {
      // storage blocked: the choice lasts for this visit
    }
  }

  const customText = [strings.customTextInTimeSelector];
  const duplicates = likelyDuplicates(students);
  const shown = sortStudents(
    students.filter((student) => matchesSearch(student, search)),
    sort,
  );

  const controls = students.length > 1 && (
    <FilterBar>
      <FilterInput value={search} onChange={setSearch} placeholder="Find a student" ariaLabel="Find a student" />
      <div className="trailing">
        <Selector
          options={STUDENT_SORTS}
          optionLabel={(option) => option.label}
          optionValue={(option) => option.value}
          selectedValue={sort}
          onChange={(event) => chooseSort(event.target.value)}
          ariaLabel="Sort the students"
          showPlaceholder={false}
        />
      </div>
    </FilterBar>
  );

  let rows = (
    <ScrollableTable>
      {shown.map((student, index) => (
        <StudentInfoLine
          key={student.id}
          cohortID={cohortID}
          student={student}
          duplicates={duplicates[student.id]}
          removeStudentFromCohort={removeStudentFromCohort}
          isFirst={index === 0}
        />
      ))}
    </ScrollableTable>
  );
  if (shown.length === 0) rows = <EmptyState message={`No student matches "${search}".`} fillHeight={false} />;

  return (
    <CenteredContentContainer>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      {controls}
      {rows}
    </CenteredContentContainer>
  );
};
export default StudentsActivityOverviewContent;
