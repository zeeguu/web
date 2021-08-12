import strings from "../i18n/definitions";
import TutorialItemCard from "./TutorialItemCard";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import * as scs from "./TutorialItemCard.sc";
import { setTitle } from "../assorted/setTitle";

export default function Tutorials() {
  setTitle(strings.tutorials);
  return (
    <s.NarrowColumn>
      <scs.StyledTutorialItemCard>
        <sc.TopTabs>
          <h1>{strings.tutorials}</h1>
        </sc.TopTabs>
        <p>{strings.howToAddAndEditClass}</p>
        <TutorialItemCard embedId="9uoTad2J14I" />
        <p>{strings.howToDeleteClass}</p>
        <TutorialItemCard embedId="yxn1Fv2awbE" />
        <p>{strings.howToAddStudent}</p>
        <TutorialItemCard embedId="NRWPxpbqR3I" />
        <p>{strings.howToDeleteStudents}</p>
        <TutorialItemCard embedId="huvypq6hI1o" />
        <p>{strings.howToAddTextFromZeeguu} </p>
        <TutorialItemCard embedId="B_9iTt6Ktxc" />
        <p>{strings.howToAddTextCopyPaste} </p>
        <TutorialItemCard embedId="Q07gT7ZKYC8" />
        <p>{strings.howToAddTextUrl}</p>
        <TutorialItemCard embedId="tmYHEWm7ks4" />
        <p>{strings.howToEditAndDeleteText}</p>
        <TutorialItemCard embedId="-t7TjCUQCX4" />
        <p>{strings.howToShareText}</p>
        <TutorialItemCard embedId="OfjBEzshG44" />
        <p>{strings.howToExplainZeeguuData}</p>
        <TutorialItemCard embedId="WmyVNxZn1RA" />
        <p>{strings.howToUnderstandTextLevel}</p>
        <TutorialItemCard embedId="J4WUKEGShJI" />
      </scs.StyledTutorialItemCard>
    </s.NarrowColumn>
  );
}
