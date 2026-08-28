import { Link } from "react-router-dom";
import TopTabs from "../../../components/TopTabs";
import * as s from "./ClassTabs.sc";

/**
 * Students | Texts for one class.
 *
 * The page used to put "Add Students" and "Back to Classes" side by side as
 * buttons of equal weight, so navigating away looked exactly like the page's
 * primary action. Navigation is tabs and a back link; buttons are for doing
 * something to the class.
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
    <s.Wrapper>
      <s.BackLink>
        <Link to="/teacher/classes">← All classes</Link>
      </s.BackLink>
      <s.ClassName>{cohortName}</s.ClassName>
      <TopTabs tabsAndLinks={tabs} isCompact={true} />
    </s.Wrapper>
  );
}
