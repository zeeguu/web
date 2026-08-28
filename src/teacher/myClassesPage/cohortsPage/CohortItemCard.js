import { Link } from "react-router-dom";
import { MdPeople } from "react-icons/md/";
import { MetaStrip, MetaItem } from "../../../components/MetaStrip.sc";
import DynamicFlagImage from "../../../components/DynamicFlagImage";
import { languageCodeFromName } from "../../../utils/misc/languageCodeToName";
import * as s from "../../styledComponents/TeacherListRow.sc";
import strings from "../../../i18n/definitions";

/**
 * One class in the My Classrooms list, in the same shape as a text on My Texts:
 * a title and one metadata strip.
 *
 * Deliberately no buttons. Three outlined buttons per row turned the page into
 * a wall of blue for a teacher with any number of classes, and See Students
 * only repeated the title's own link. Editing the class and adding a teacher
 * live inside the class, which is where you are once you care about them.
 */
export const CohortItemCard = ({ cohort }) => {
  const classPath = `/teacher/classes/viewClass/${cohort.id}`;
  const teachers = cohort.teachers_for_cohort || [];
  const languageCode = languageCodeFromName(cohort.language_name);

  return (
    <s.Row>
      {languageCode && (
        <s.Flag>
          <DynamicFlagImage languageCode={languageCode} size={"1.1rem"} />
        </s.Flag>
      )}
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

      </s.Body>
    </s.Row>
  );
};
export default CohortItemCard;
