import { useContext, useState } from "react";
import BackArrow from "../../../pages/Settings/SharedComponents/BackArrow";
import TopTabs from "../../../components/TopTabs";
import { APIContext } from "../../../contexts/APIContext";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import { TeacherPageHeading } from "../../styledComponents/TeacherPageHeading.sc";
import strings from "../../../i18n/definitions";
import CohortForm from "./CohortForm";
import AddTeacherDialog from "./AddTeacherDialog";
import * as s from "./ClassTabs.sc";

/**
 * The class's own header: name, way back, tabs, and the two things you can do
 * to the class itself.
 *
 * Editing the class and adding a teacher used to be buttons on every row of My
 * Classrooms, which turned that page into a wall of blue. They belong to one
 * class, so they live here — and they live in the shared header rather than in
 * either tab, so the header does not change between Students and Texts.
 */
export default function ClassTabs({ cohortID, cohort, textCount, onClassChanged }) {
  const api = useContext(APIContext);
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  // CohortForm checks the new invite code against every class the teacher owns.
  const [allCohorts, setAllCohorts] = useState([]);

  const base = `/teacher/classes/viewClass/${cohortID}`;

  const tabs = [
    { text: strings.students, link: base, isActive: (_, loc) => loc.pathname === base },
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
    <s.ClassHeader>
      <div className="title-row">
        <BackArrow redirectLink="/teacher/classes" />
        <TeacherPageHeading>{cohort?.name}</TeacherPageHeading>
        <div className="actions">
          <StyledButton $secondary onClick={openEdit}>
            {strings.editClass}
          </StyledButton>
          <StyledButton $secondary onClick={() => setShowAddTeacherDialog(true)}>
            {strings.addTeacher}
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
        />
      )}
      {showAddTeacherDialog && (
        <AddTeacherDialog
          cohort={cohort}
          setIsOpen={setShowAddTeacherDialog}
          setForceUpdate={onClassChanged}
        />
      )}
    </s.ClassHeader>
  );
}
