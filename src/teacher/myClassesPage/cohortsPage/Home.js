import React, { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../../../components/LoadingAnimation";
import CohortList from "./CohortList";
import NotATeacherNotice from "../../sharedComponents/NotATeacherNotice";
import strings from "../../../i18n/definitions";
import { setTitle } from "../../../assorted/setTitle";
import * as s from "../../../components/ColumnWidth.sc";
import {
  TeacherPageHeader,
  TeacherPageHeading,
  TeacherPageSubtitle,
} from "../../styledComponents/TeacherPageHeading.sc";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import { APIContext } from "../../../contexts/APIContext";
import Selector from "../../../components/Selector";
import { FilterBar } from "../../styledComponents/TextFilterBar.sc";
import { COHORT_SORTS, DEFAULT_COHORT_SORT } from "./cohortSort";

const SORT_KEY = "teacher_class_sort";

function rememberedSort() {
  try {
    return window.localStorage.getItem(SORT_KEY) || DEFAULT_COHORT_SORT;
  } catch {
    return DEFAULT_COHORT_SORT; // storage blocked
  }
}

function Home() {
  const api = useContext(APIContext);
  const [cohorts, setCohorts] = useState();
  const [notATeacher, setNotATeacher] = useState(false);
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [sort, setSort] = useState(rememberedSort);

  function chooseSort(value) {
    setSort(value);
    try {
      window.localStorage.setItem(SORT_KEY, value);
    } catch {
      // storage blocked: the choice lasts for this visit
    }
  }
  setTitle(strings.myClasses);
  useEffect(() => {
    api.getCohortsInfo(setCohorts, (e) => {
      // A 401 here means the logged-in account isn't a teacher account, so we
      // explain that instead of spinning forever. Other errors (network) fall
      // through to the loading state, matching the previous behaviour.
      if (/HTTP 401/.test(e?.message)) setNotATeacher(true);
    });
    // eslint-disable-next-line
  }, [forceUpdate]);

  const studentCount = (cohorts || []).reduce((total, cohort) => total + (cohort.cur_students || 0), 0);

  let content;
  if (notATeacher) {
    content = <NotATeacherNotice />;
  } else if (cohorts) {
    const sortControl = cohorts.length > 1 && (
      <FilterBar>
        <div className="trailing">
          <Selector
            options={COHORT_SORTS}
            optionLabel={(option) => option.label}
            optionValue={(option) => option.value}
            selectedValue={sort}
            onChange={(event) => chooseSort(event.target.value)}
            ariaLabel="Sort the classes"
            showPlaceholder={false}
          />
        </div>
      </FilterBar>
    );
    content = (
      <div>
        {sortControl}
        <CohortList
          setForceUpdate={setForceUpdate}
          cohorts={cohorts}
          sort={sort}
          showCohortForm={showCohortForm}
          setShowCohortForm={setShowCohortForm}
        />
      </div>
    );
  } else {
    content = <LoadingAnimation />;
  }

  return (
    <s.NarrowColumn>
      <TeacherPageHeader>
        <div>
          <TeacherPageHeading>{strings.myClasses}</TeacherPageHeading>
          {cohorts && (
            <TeacherPageSubtitle>
              {cohorts.length} {cohorts.length === 1 ? "class" : "classes"} · {studentCount}{" "}
              {studentCount === 1 ? "student" : "students"}
            </TeacherPageSubtitle>
          )}
        </div>
        {cohorts && (
          <StyledButton $primary onClick={() => setShowCohortForm(true)}>
            {strings.addClass}
          </StyledButton>
        )}
      </TeacherPageHeader>
      {content}
    </s.NarrowColumn>
  );
}

export default Home;
