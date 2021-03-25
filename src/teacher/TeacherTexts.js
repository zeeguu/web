import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";

export default function TeacherTexts() {
  return (
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{strings.myTexts}</h1>
        </sc.TopTabs>
      </s.NarrowColumn>
  );
}
