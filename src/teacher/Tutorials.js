import strings from "../i18n/definitions";
import TutorialItemCard from "./TutorialItemCard";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

export default function Tutorials() {
  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>{strings.tutorials}</h1>
      </sc.TopTabs>
      <p>{strings.howToAddAndEditClass}</p>
      <TutorialItemCard embedId="cWTUrEY4p4M" />
      <p className="tutorialTitle">{strings.howToDeleteClass}</p>
      <TutorialItemCard embedId="_u-PAZvHuwQ" />
      <TutorialItemCard headline={strings.howToAddStudent} />
      <TutorialItemCard headline={strings.howToDeleteStudents} />
      <TutorialItemCard headline={strings.howToAddText} />
      <TutorialItemCard headline={strings.howToEditAndDeleteText} />
      <TutorialItemCard headline={strings.howToShareText} />
      <TutorialItemCard headline={strings.howToExplainZeeguuData} />
    </s.NarrowColumn>
  );
}
