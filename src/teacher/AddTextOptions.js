//import strings from "../i18n/definitions";
import React, { Fragment, useState } from "react";
import { useHistory } from "react-router";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import {
  AddFromZeeguuOption,
  AddURLOption,
  TypeCopyPasteOption,
} from "./AddTextOptionTypes";
import { LabeledTextField } from "./LabeledInputFields";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

export default function AddTextOptions({ api }) {
  const history = useHistory();
  const [showDialog, setShowDialog] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    console.log("Setting value to: " + event.target.value)
    setValue(event.target.value);
  };

  const getArticle = () =>{
    //TODO here we create the article and save it in own texts
    history.push("/teacher/texts/editText/new")//TODO this should route to the /articleID not /new.
    
  }

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
        <AddURLOption onClick={() => setShowDialog(true)} />
      </s.NarrowColumn>
      {showDialog && (
        <StyledDialog
          aria-label="Add a text from a url address."
          onDismiss={() => setShowDialog(false)}
          max_width="525px"
        >
          <h1>Add text from URL address STRINGS</h1>
          <LabeledTextField
            value={value}
            onChange={handleChange}
            name="url_address"
            placeholder="eg. 'http://www.news.com/article/19358538'"
          >
            Insert the url address of the text your wish to add
          </LabeledTextField>
          <PopupButtonWrapper>
            <StyledButton primary onClick={getArticle}>Add to editor STRINGS</StyledButton>
          </PopupButtonWrapper>
        </StyledDialog>
      )}
    </Fragment>
  );
}
