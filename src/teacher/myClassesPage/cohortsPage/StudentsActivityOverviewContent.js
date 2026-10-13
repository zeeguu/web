import React, { useState } from "react";
import FilterInput from "../../sharedComponents/FilterInput";
import Selector from "../../../components/Selector";
import EmptyState from "../../../components/EmptyState";
import { ScrollableTable } from "../../styledComponents/ScrollableTable.sc";
import * as t from "./ClassTable.sc";
import StudentRow from "./StudentRow";
import { likelyDuplicates } from "./duplicateStudents";
import { DEFAULT_STUDENT_SORT, STUDENT_SORTS, matchesSearch, sortStudents } from "./studentSort";
import { CLASS_PERIODS } from "./studentRowText";

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

const selector = (options, value, onChange, ariaLabel) => (
  <Selector
    options={options}
    optionLabel={(option) => option.label}
    optionValue={(option) => option.value}
    selectedValue={value}
    onChange={(event) => onChange(event.target.value)}
    ariaLabel={ariaLabel}
    showPlaceholder={false}
  />
);

// A class's students as a table: who they are, when they were last active,
// how much time they spent in the period (by kind of activity), what they
// read and practised. A row opens the student.
export default function StudentsActivityOverviewContent({
  cohortID,
  students,
  period,
  onPeriodChange,
  removeStudentFromCohort,
}) {
  const [sort, setSort] = useState(rememberedSort);
  const [search, setSearch] = useState("");

  function chooseSort(value) {
    setSort(value);
    try {
      window.localStorage.setItem(SORT_KEY, value);
    } catch {
      // storage blocked: the choice lasts for this visit
    }
  }

  const duplicates = likelyDuplicates(students);
  const shown = sortStudents(
    students.filter((student) => matchesSearch(student, search)),
    sort,
  );
  const classMaxTime = Math.max(0, ...students.map((student) => student.total_time || 0));

  let table = (
    <ScrollableTable>
      <t.Table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Last active</th>
            <th>Time</th>
            <th className="num">Texts</th>
            <th className="num">Exercises</th>
            <th className="num">Correct</th>
            <th aria-label="Remove" />
          </tr>
        </thead>
        <tbody>
          {shown.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              cohortID={cohortID}
              classMaxTime={classMaxTime}
              duplicates={duplicates[student.id]}
              removeStudentFromCohort={removeStudentFromCohort}
            />
          ))}
        </tbody>
      </t.Table>
    </ScrollableTable>
  );
  if (shown.length === 0) table = <EmptyState message={`No student matches "${search}".`} fillHeight={false} />;

  return (
    <>
      <t.Toolbar>
        <FilterInput value={search} onChange={setSearch} placeholder="Find a student" ariaLabel="Find a student" />
        {selector(STUDENT_SORTS, sort, chooseSort, "Sort the students")}
        <div className="period">{selector(CLASS_PERIODS, String(period), onPeriodChange, "Period")}</div>
      </t.Toolbar>
      {table}
    </>
  );
}
