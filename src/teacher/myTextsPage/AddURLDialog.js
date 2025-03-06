import React, { useContext, useEffect, useState } from "react";
import strings from "../../i18n/definitions";
import { useHistory } from "react-router";
import { LabeledTextField } from "../sharedComponents/LabeledInputFields";
import { StyledDialog } from "../styledComponents/StyledDialog.sc";
import * as s from "../styledComponents/AddURLDialog.sc";
import {
  PopupButtonWrapper,
  StyledButton,
} from "../styledComponents/TeacherButtons.sc";
import { Error } from "../sharedComponents/Error";
import { APIContext } from "../../contexts/APIContext";

export default function AddURLDialog({ setShowAddURLDialog }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [showGuidance, setShowGuidance] = useState(false);
  const [showError, setShowError] = useState(false);
  const [url, setURL] = useState("");

  useEffect(() => {
    if (url !== "") {
      setShowGuidance(false);
    }
    setShowError(false);
  }, [url]);

  const handleChange = (event) => {
    setURL(event.target.value);
  };

  const getArticle = () => {
    if (url === "") {
      setShowGuidance(true);
    } else {
      api.parseArticleFromUrl(
        url,
        (articleInfo) => {
          const newTitle = articleInfo.title;
          const newText = articleInfo.text;
          const newLanguage = articleInfo.language_code;
          api.uploadOwnText(newTitle, newText, newLanguage, (newID) => {
            history.push(`/teacher/texts/editText/${newID}`);
          });
        },
        (err) => {
          setShowError(true);
          console.log(
            "An error occurred. It might be caused by an invalid URL: ",
          );
          console.log(err);
        },
      );
    }
  };

  return (
    <StyledDialog
      aria-label={strings.addTextFromWebpage}
      onDismiss={() => setShowAddURLDialog(false)}
      max_width="525px"
    >
      <s.StyledURLDialog>
        <h1 className="add-text-headline">{strings.addTextFromWebpage}</h1>
      </s.StyledURLDialog>
      <LabeledTextField
        value={url}
        onChange={handleChange}
        name="url_address"
        placeholder="eg. 'http://www.news.com/article/19358538'"
      >
        {strings.insertUrl}
      </LabeledTextField>
      <p>
        <b>{strings.pleaseNote}</b> {strings.textNotExtracted} <br />{" "}
        {strings.editTheSavedText}
      </p>
      {showGuidance && <Error message={strings.nothingInInputField} />}
      {showError && <Error message={strings.invalidUrl} />}
      <PopupButtonWrapper>
        <StyledButton primary onClick={getArticle}>
          {strings.saveAndEdit}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
