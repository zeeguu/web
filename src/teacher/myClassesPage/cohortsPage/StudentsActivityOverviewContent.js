import React, { useState } from "react";
import FilterInput from "../../sharedComponents/FilterInput";
import Selector from "../../../components/Selector";
import EmptyState from "../../../components/EmptyState";
import { ScrollableTable } from "../../styledComponents/ScrollableTable.sc";
import * as t from "./ClassTable.sc";
import StudentRow from "./StudentRow";
import { likelyDuplicates } from "./duplicateStudents";
import { DEFAULT_STUDENT_SORT, SORT_COLUMNS, matchesSearch, nextSort, sortStudents } from "./studentSort";
import { CLASS_PERIODS } from "./studentRowText";

// One order for every class: a teacher who wants the idle students on top
// wants them on top in all of their classes.
const SORT_KEY = "teacher_student_sort";

function rememberedSort() {
  try {
    const sort = JSON.parse(window.localStorage.getItem(SORT_KEY));
    return SORT_COLUMNS[sort?.key] ? sort : DEFAULT_STUDENT_SORT;
  } catch {
    return DEFAULT_STUDENT_SORT; // storage blocked, or an older string value
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

  function sortBy(key) {
    const next = nextSort(sort, key);
    setSort(next);
    try {
      window.localStorage.setItem(SORT_KEY, JSON.stringify(next));
    } catch {
      // storage blocked: the choice lasts for this visit
    }
  }

  // A column header that sorts: the arrow shows the current order.
  const header = (key, label, className) => {
    const active = sort.key === key;
    return (
      <th className={className} aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
        <t.SortButton onClick={() => sortBy(key)} $active={active}>
          {label}
          <span className="arrow">{active ? (sort.dir === "asc" ? "▲" : "▼") : ""}</span>
        </t.SortButton>
      </th>
    );
  };

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
            {header("name", "Student")}
            {header("last_active", "Last active")}
            {header("time", "Time")}
            {header("texts", "Texts", "num")}
            {header("exercises", "Exercises", "num")}
            {header("correct", "Correct", "num")}
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
        <div className="period">{selector(CLASS_PERIODS, String(period), onPeriodChange, "Period")}</div>
      </t.Toolbar>
      {table}
    </>
  );
}
