//import strings from "../i18n/definitions";
import React, { Fragment, useState } from "react";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import {
  AddFromZeeguuOption,
  AddURLOption,
  TypeCopyPasteOption,
} from "./AddTextOptionTypes";
import AddURLDialog from "./AddURLDialog";

export default function AddTextOptions({ api }) {
  const [showAddURLDialog, setShowAddURLDialog] = useState(false);

  return (
    <Fragment>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>STRINGSAddTexts</h1>
        </sc.TopTabs>
        <br />
        <br />
        <AddFromZeeguuOption />
        <TypeCopyPasteOption />
        <AddURLOption onClick={() => setShowAddURLDialog(true)} />
      </s.NarrowColumn>
      {showAddURLDialog && (
        <AddURLDialog api={api} setShowAddURLDialog={setShowAddURLDialog} />
      )}
    </Fragment>
  );
}
