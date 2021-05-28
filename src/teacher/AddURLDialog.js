//import strings from "../i18n/definitions";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { LabeledTextField } from "./LabeledInputFields";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

export default function AddURLDialog({ api, setShowAddURLDialog }) {
  const history = useHistory();
  const [showGuidance, setShowGuidance] = useState(false);
  const [url, setURL] = useState("");

  useEffect(() => {
    if (url !== "") {
      setShowGuidance(false);
    }
  }, [url]);

  const handleChange = (event) => {
    console.log("Setting the url to: " + event.target.value);
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
            console.log(`article created from the url with id: ${newID}`);
            history.push(`/teacher/texts/editText/${newID}`);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  return (
    <StyledDialog
      aria-label="Add a text from a url address."
      onDismiss={() => setShowAddURLDialog(false)}
      max_width="525px"
    >
      <h1>Add text from a webpage STRINGS</h1>
      <LabeledTextField
        value={url}
        onChange={handleChange}
        name="url_address"
        placeholder="eg. 'http://www.news.com/article/19358538'"
      >
        Insert the url address of the text your wish to add STRINGS
      </LabeledTextField>
      <p>
        <b>Please note:</b> Texts cannot be extracted from all webpages. <br />{" "}
        So you might have to edit or delete the text, we save for you. STRINGS
      </p>
      {showGuidance && (
        <p style={{ color: "red" }}>
          You haven't typed anything in the input field yet.STRINGS
        </p>
      )}
      <PopupButtonWrapper>
        <StyledButton primary onClick={getArticle}>
          Save and edit STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
}
