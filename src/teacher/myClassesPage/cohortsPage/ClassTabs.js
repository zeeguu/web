import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import BackArrow from "../../../pages/Settings/SharedComponents/BackArrow";
import TopTabs from "../../../components/TopTabs";
import { APIContext } from "../../../contexts/APIContext";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import { TeacherPageHeading, TeacherPageSubtitle } from "../../styledComponents/TeacherPageHeading.sc";
import { languageName } from "../../../utils/misc/languageCodeToName";
import strings from "../../../i18n/definitions";
import CohortForm from "./CohortForm";
import AddTeacherDialog from "./AddTeacherDialog";
import * as s from "../../styledComponents/DetailHeader.sc";

/**
 * The class's own header: the way back, the name, what the class is, and its
 * tabs, the same on Students and Texts.
 *
 * The invite code is in the line under the name. It used to sit behind an
 * "Add Students" button whose dialog said nothing else; a code the teacher
 * reads out in class should not take a click to find.
 *
 * Editing the class and adding a teacher are rare, so they sit at the top
 * right, on the breadcrumb's row, out of the way of the title and tabs.
 */
export default function ClassTabs({ cohortID, cohort, textCount, studentCount, onClassChanged }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  // CohortForm checks the new invite code against every class the teacher owns.
  const [allCohorts, setAllCohorts] = useState([]);

  const base = `/teacher/classes/viewClass/${cohortID}`;

  const tabs = [
    // Literal, like the Texts label below: i18n/definitions has no `students`
    // key, and looking one up there rendered this tab with no label at all.
    {
      text: studentCount === undefined ? "Students" : `Students (${studentCount})`,
      link: base,
      isActive: (_, loc) => loc.pathname === base,
    },
    {
      text: textCount === undefined ? "Texts" : `Texts (${textCount})`,
      link: `${base}/texts`,
    },
  ];

  // The Texts tab's payload has the language as a code, the Students tab's
  // (getCohortsInfo) as a name.
  const language = cohort?.language ? languageName(cohort.language) : cohort?.language_name;

  function openEdit() {
    api.getCohortsInfo(setAllCohorts);
    setShowCohortForm(true);
  }

  return (
    <s.DetailHeader>
      <div className="top-row">
        <BackArrow redirectLink="/teacher/classes" label={strings.myClasses} />
        <div className="actions">
          <StyledButton $secondary onClick={() => setShowAddTeacherDialog(true)}>
            {strings.addTeacher}
          </StyledButton>
          <StyledButton $secondary onClick={openEdit}>
            {strings.editClass}
          </StyledButton>
        </div>
      </div>
      <TeacherPageHeading>{cohort?.name}</TeacherPageHeading>
      <TeacherPageSubtitle>
        {[language, cohort?.inv_code && `invite code ${cohort.inv_code}`].filter(Boolean).join(" · ")}
      </TeacherPageSubtitle>
      <TopTabs tabsAndLinks={tabs} isCompact={true} stickyOnScroll={false} underlined={true} />

      {showCohortForm && (
        <CohortForm
          setShowCohortForm={setShowCohortForm}
          setForceUpdate={onClassChanged}
          cohort={cohort}
          cohorts={allCohorts}
          onDeleted={() => history.replace("/teacher/classes")}
        />
      )}
      {showAddTeacherDialog && (
        <AddTeacherDialog cohort={cohort} setIsOpen={setShowAddTeacherDialog} setForceUpdate={onClassChanged} />
      )}
    </s.DetailHeader>
  );
}
