//import strings from "../i18n/definitions";
import React, {Fragment} from "react";
import * as s from "../components/ColumnWidth.sc";
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
    <Fragment>
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
    </Fragment>
  );
}
