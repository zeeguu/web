import BackArrow from "../../../pages/Settings/SharedComponents/BackArrow";
import TopTabs from "../../../components/TopTabs";
import { TeacherPageHeading } from "../../styledComponents/TeacherPageHeading.sc";
import * as s from "./ClassTabs.sc";

/**
 * Students | Texts for one class.
 *
 * The page used to put "Add Students" and "Back to Classes" side by side as
 * buttons of equal weight, so navigating away looked exactly like the page's
 * primary action. Navigation is tabs and the shared BackArrow (which also
 * wires up swipe-back); buttons are for doing something to the class.
 */
export default function ClassTabs({ cohortID, cohortName, textCount }) {
  const base = `/teacher/classes/viewClass/${cohortID}`;

  const tabs = [
    { text: "Students", link: base, isActive: (_, loc) => loc.pathname === base },
    {
      text: textCount === undefined ? "Texts" : `Texts (${textCount})`,
      link: `${base}/texts`,
    },
  ];

  return (
    <s.ClassHeader>
      <div className="title-row">
        <BackArrow redirectLink="/teacher/classes" />
        <TeacherPageHeading>{cohortName}</TeacherPageHeading>
      </div>
      <TopTabs tabsAndLinks={tabs} isCompact={true} />
    </s.ClassHeader>
  );
}
