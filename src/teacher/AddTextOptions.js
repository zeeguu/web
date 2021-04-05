//import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import {
  AddFromZeeguuOption,
  AddURLOption,
  TypeCopyPasteOption,
} from "./AddTextOptionTypes";

export default function AddTextOptions() {

  function handleOpenDialog() {
    console.log("This should open the popup!!!");
  }

  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>STRINGSAddTexts</h1>
      </sc.TopTabs>
      <br/>
      <br/>
      <AddFromZeeguuOption />
      <TypeCopyPasteOption />
      <AddURLOption onClick={handleOpenDialog} />
    </s.NarrowColumn>
  );
}
