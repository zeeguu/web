import React, { Fragment, useState } from "react";
import strings from "../../i18n/definitions";
import { setTitle } from "../../assorted/setTitle";
import * as s from "../../components/ColumnWidth.sc";
import * as sc from "../../components/TopTabs.sc";
import {
  AddFromZeeguuOption,
  AddURLOption,
  TypeCopyPasteOption,
} from "./AddTextOptionTypes";
import AddURLDialog from "./AddURLDialog";

export default function AddTextOptions() {
  const [showAddURLDialog, setShowAddURLDialog] = useState(false);
  setTitle(strings.addTexts);
  return (
    <Fragment>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{strings.addTexts}</h1>
        </sc.TopTabs>
        <br />
        <br />
        <AddFromZeeguuOption />
        <TypeCopyPasteOption />
        <AddURLOption onClick={() => setShowAddURLDialog(true)} />
      </s.NarrowColumn>
      {showAddURLDialog && (
        <AddURLDialog setShowAddURLDialog={setShowAddURLDialog} />
      )}
    </Fragment>
  );
}
