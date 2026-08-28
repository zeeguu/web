import { Link } from "react-router-dom";
import { MdPeople } from "react-icons/md/";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import { MetaStrip, MetaItem } from "../../../components/MetaStrip.sc";
import * as s from "../../styledComponents/TeacherListRow.sc";
import strings from "../../../i18n/definitions";

/**
 * One class in the My Classrooms list, in the same shape as a text on My Texts:
 * title, one metadata strip, actions. It used to be a shadowed card with the
 * same facts stacked as five paragraphs, which is why the two teacher pages
 * looked like they came from different products.
 */
export const CohortItemCard = ({
  cohort,
  isWarning,
  setShowCohortForm,
  setCohortToEdit,
  setShowAddTeacherDialog,
}) => {
  const classPath = `/teacher/classes/viewClass/${cohort.id}`;
  const teachers = cohort.teachers_for_cohort || [];

  function handleEdit() {
    setCohortToEdit(cohort);
    setShowCohortForm(true);
  }

  function handleAddTeacher() {
    setCohortToEdit(cohort);
    setShowAddTeacherDialog(true);
  }

  return (
    <s.Row>
      <s.Body>
        <Link to={classPath}>
          <s.Title>{cohort.name}</s.Title>
        </Link>

        <MetaStrip>
          <MetaItem>{strings[cohort.language_name.toLowerCase()]}</MetaItem>
          <MetaItem>
            {cohort.cur_students} <MdPeople size="16px" />
          </MetaItem>
          <MetaItem>
            {strings.inviteCode}: {cohort.inv_code}
          </MetaItem>
          {teachers.length > 0 && (
            <MetaItem>
              {teachers.length > 1 ? strings.teachers : strings.teacher}
              {teachers.map((each) => each.name).join(", ")}
            </MetaItem>
          )}
        </MetaStrip>

        {!isWarning && (
          <s.Actions>
            <Link to={classPath}>
              <StyledButton $secondary>{strings.seeStudents}</StyledButton>
            </Link>
            <StyledButton $secondary onClick={handleEdit}>
              {strings.editClass}
            </StyledButton>
            <StyledButton $secondary onClick={handleAddTeacher}>
              {strings.addTeacher}
            </StyledButton>
          </s.Actions>
        )}
      </s.Body>
    </s.Row>
  );
};
export default CohortItemCard;
