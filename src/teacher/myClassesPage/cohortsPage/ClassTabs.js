import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import BackArrow from "../../../pages/Settings/SharedComponents/BackArrow";
import TopTabs from "../../../components/TopTabs";
import { APIContext } from "../../../contexts/APIContext";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import { TeacherPageHeading } from "../../styledComponents/TeacherPageHeading.sc";
import strings from "../../../i18n/definitions";
import CohortForm from "./CohortForm";
import AddTeacherDialog from "./AddTeacherDialog";
import HowToAddStudentsInfo from "./HowToAddStudentsInfo";
import * as s from "../../styledComponents/DetailHeader.sc";

/**
 * The class's own header: name, way back, tabs, and the two things you can do
 * to the class itself.
 *
 * Editing the class and adding people to it used to be buttons on every row of
 * My Classrooms, which turned that page into a wall of blue. They belong to one
 * class, so they live here — and they live in the shared header rather than in
 * either tab, so the header does not change between Students and Texts.
 *
 * Add Students is absent from a class that has none: the Students tab's empty
 * state already gives the invite code and says what to do with it, which is all
 * this button's dialog says.
 */
export default function ClassTabs({ cohortID, cohort, textCount, studentCount, onClassChanged }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  const [showAddStudentsInfo, setShowAddStudentsInfo] = useState(false);
  // CohortForm checks the new invite code against every class the teacher owns.
  const [allCohorts, setAllCohorts] = useState([]);

  const base = `/teacher/classes/viewClass/${cohortID}`;

  const tabs = [
    // Literal, like the Texts label below: i18n/definitions has no `students`
    // key, and looking one up there rendered this tab with no label at all.
    { text: "Students", link: base, isActive: (_, loc) => loc.pathname === base },
    {
      text: textCount === undefined ? "Texts" : `Texts (${textCount})`,
      link: `${base}/texts`,
    },
  ];

  function openEdit() {
    api.getCohortsInfo(setAllCohorts);
    setShowCohortForm(true);
  }

  return (
    <s.DetailHeader>
      <div className="title-row">
        <BackArrow redirectLink="/teacher/classes" />
        <TeacherPageHeading>{cohort?.name}</TeacherPageHeading>
        <div className="actions">
          {studentCount > 0 && (
            <StyledButton $secondary onClick={() => setShowAddStudentsInfo(true)}>
              {strings.addStudents}
            </StyledButton>
          )}
          <StyledButton $secondary onClick={() => setShowAddTeacherDialog(true)}>
            {strings.addTeacher}
          </StyledButton>
          <StyledButton $secondary onClick={openEdit}>
            {strings.editClass}
          </StyledButton>
        </div>
      </div>
      <TopTabs tabsAndLinks={tabs} isCompact={true} />

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
        <AddTeacherDialog
          cohort={cohort}
          setIsOpen={setShowAddTeacherDialog}
          setForceUpdate={onClassChanged}
        />
      )}
      {showAddStudentsInfo && (
        <HowToAddStudentsInfo
          setShowAddStudentInfo={setShowAddStudentsInfo}
          inviteCode={cohort?.inv_code}
        />
      )}
    </s.DetailHeader>
  );
}
