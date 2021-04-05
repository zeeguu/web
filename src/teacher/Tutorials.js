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
        <TutorialItemCard headline="Testing with random video...(STRINGS)" video="https://www.youtube.com/embed/WmVLcj-XKnM" />
        <TutorialItemCard headline="How to add and edit a class...(STRINGS)" />
        <TutorialItemCard headline="How to delete a class...(STRINGS)" />
        <TutorialItemCard headline="How to add students...(STRINGS)" />
        <TutorialItemCard headline="How to delete students...(STRINGS)" />
        <TutorialItemCard headline="How to add a text...(STRINGS)" />
        <TutorialItemCard headline="How to edit or delete a text...(STRINGS)" />
        <TutorialItemCard headline="How to share texts with your class/classes...(STRINGS)" />
        <TutorialItemCard headline="The data you can find in Zeeguu explained...(STRINGS)" />
      </s.NarrowColumn>
  );
}
