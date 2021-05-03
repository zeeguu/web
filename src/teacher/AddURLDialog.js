//import strings from "../i18n/definitions";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { LabeledTextField } from "./LabeledInputFields";
import { LanguageSelector } from "./LanguageSelector";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

export default function AddURLDialog({ api, setShowAddURLDialog }) {
  const history = useHistory();
  const [showGuidance, setShowGuidance] = useState(false);
  const [languageCode, setLanguageCode] = useState("default");
  const [url, setURL] = useState("");

  useEffect(() => {
    if (url !== "" && languageCode !== "default") {
      setShowGuidance(false);
    }
  }, [url, languageCode]);

  const handleChange = (event) => {
    console.log("Setting the url to: " + event.target.value);
    setURL(event.target.value);
  };

  function handleLanguageChange(selectedLanguage) {
   setLanguageCode(selectedLanguage)

  }

 //testURL: https://www.dr.dk/nyheder/indland/danmark-dropper-vaccinen-fra-johnson-johnson
  const getArticle = () => {
    if (url === "" || languageCode === "default") {
      setShowGuidance(true);
    } else {
      api.parseURL(
        url,
        (article) => {
          //console.log(article);
          const titleEnd = article.substring(19).indexOf('"') + 19;
          const newTitle = article.substring(19, titleEnd);
          const bodyStart = titleEnd + 12;
          const bodyEnd = article.length - 2;
          const newBody = article.substring(bodyStart, bodyEnd);

          //console.log(newTitle);
          //console.log(newBody);
          api.uploadOwnText(
              newTitle,
              newBody,
              languageCode,
              (newID)=>{
                  console.log(`article created from the url with id: ${newID}`);
                  history.push(`/teacher/texts/editText/${newID}`)
              }
          )
        },
        (err) => console.log(err)
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
      <LanguageSelector value={languageCode} onChange={handleLanguageChange}>
        Please, define the language of the text STRINGS
      </LanguageSelector>
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
          You must fill in both of the input fields above.STRINGS
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
