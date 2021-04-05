import strings from "../i18n/definitions";
import TutorialItemCard from "./TutorialItemCard";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";

export default function Tutorials() {
  return (
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{strings.tutorials}</h1>
        </sc.TopTabs>
        <TutorialItemCard headline="Testing with random video..." video="https://www.youtube.com/embed/WmVLcj-XKnM" />
        <TutorialItemCard headline="Testing with no video..." />
      </s.NarrowColumn>
  );
}
