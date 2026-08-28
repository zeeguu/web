import BackArrow from "../../pages/Settings/SharedComponents/BackArrow";
import TopTabs from "../../components/TopTabs";
import { TeacherPageHeading } from "../styledComponents/TeacherPageHeading.sc";
import * as s from "../styledComponents/DetailHeader.sc";

/**
 * One student's header: their name, the way back to the class, and the two
 * views the teacher has of them.
 *
 * Reading and Exercises used to be a pair of buttons — "See Exercises" next to
 * "Back to <class>" — which made navigating away look like the page's primary
 * action, and made two views of one student read as two separate errands. They
 * are tabs now, like Students and Texts on the class itself.
 */
export default function StudentTabs({ studentID, cohortID, title }) {
  const base = `/teacher/classes/viewStudent/${studentID}/class/${cohortID}`;

  const tabs = [
    { text: "Reading", link: base, isActive: (_, loc) => loc.pathname === base },
    { text: "Exercises", link: `${base}/exercises` },
  ];

  return (
    <s.DetailHeader>
      <div className="title-row">
        <BackArrow redirectLink={`/teacher/classes/viewClass/${cohortID}`} />
        <TeacherPageHeading>{title}</TeacherPageHeading>
      </div>
      <TopTabs tabsAndLinks={tabs} isCompact={true} />
    </s.DetailHeader>
  );
}
