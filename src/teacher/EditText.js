import React, { useState, useContext, Fragment, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
//import strings from "../i18n/definitions";
import { RoutingContext } from "../contexts/RoutingContext";
import { LanguageSelector } from "./LanguageSelector";
import {
  LabeledTextField,
  LabeledMultiLineTextField,
} from "./LabeledInputFields";
import {
  StyledButton,
  TopButtonWrapper,
  PopupButtonWrapper,
} from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

export default function EditText({ api }) {
  const articleID = useParams().articleID;
  console.log(articleID);

  const [state, setState] = useState({
    article_title: "",
    article_content: "",
    language_code: "default",
  });

  //The user is editing an already existing text...
  useEffect(() => {
    if (articleID !== "new") {
      api.getArticleInfo(articleID, (article) => {
        setState({
          article_title: article.title,
          article_content: article.content,
          language_code: article.language,
        });
      });
    }
    //eslint-disable-next-line
  }, []);

  //As there are two paths to EditTexts we are using RoutingContext to be able to go back on the right one on Cancel
  const { returnPath } = useContext(RoutingContext);
  const history = useHistory();

  const handleCancel = () => {
    history.push(returnPath);
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value, //ie: article_title : "Harry Potter tickets sold out", article_content : "bla bla bla"
    });
  };

  //The LanguageSelector component returns the language selected by the user as a string (not an event like the other input fields)
  function handleLanguageChange(selectedLanguage) {
    setState({
      ...state,
      language_code: selectedLanguage,
    });
  }

  const uploadArticle = () => {
    api.uploadOwnText(
      state.article_title,
      state.article_content,
      state.language_code,
      (newID) => {
        console.log(`article created with id: ${newID}`);
      }
    );
    history.push("/teacher/texts")
  };
  
  const updateArticle = () =>{
    console.log("This should call updateText...")
    history.push("/teacher/texts")
  }

  const deleteText = () => {
    api.deleteOwnText(articleID, (res) => {
      if (res === "OK") {
        console.log("Article successfully deleted");
        history.push("/teacher/texts")
      } else {
        console.log(res);
      }
    });
  };

  const addArticleToCohort = (e) => {
    e.preventDefault();
    api.addArticleToCohort(
      articleID,
      120, //!HARDCODED!!!
      (res) => {
        console.log("Connection established...");
        console.log(res);
        history.push("/teacher/texts")
      },
      () => {
        console.log("Connection to server failed...");
      }
    );
  };

  return (
    <Fragment>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>STRINGSEditText</h1>
        </sc.TopTabs>
        <TopButtonWrapper>
         {/*  <Link to="/teacher/texts"> */}
            {articleID === "new" ? (
              <StyledButton primary onClick={uploadArticle}>
                Save text without sharing STRINGS
              </StyledButton>
            ) : (
              <StyledButton
                primary
                onClick={updateArticle}
              >
                Save changes without sharing STRINGS
              </StyledButton>
            )}
         {/*  </Link> */}
          <StyledButton primary onClick={addArticleToCohort}>
            Save and share with classes STRINGS
          </StyledButton>
          <StyledButton secondary onClick={handleCancel}>
            STRINGSCancel
          </StyledButton>
        </TopButtonWrapper>
        {articleID === "new" && (
          <LanguageSelector
            value={state.language_code}
            onChange={handleLanguageChange}
          >
            Please, define the language of the text ( - This cannot be changed
            later! ) STRINGS
          </LanguageSelector>
        )}
        <LabeledTextField
          value={state.article_title}
          onChange={handleChange}
          name="article_title"
          placeholder="STRINGSPaste or type your title here..."
        >
          STRINGSClick in the box below to edit the title
        </LabeledTextField>
        <LabeledMultiLineTextField
          value={state.article_content}
          onChange={handleChange}
          name="article_content"
          placeholder="STRINGSPaste or type the body of your text here..."
        >
          STRINGSClick in the box below to edit the text body
        </LabeledMultiLineTextField>
        <PopupButtonWrapper>
          <Link to={`/teacher/texts/editText/${articleID}/studentView`}>
            <StyledButton secondary>STRINGSView as student</StyledButton>
          </Link>
          {articleID !== "new" && (
              <StyledButton secondary onClick={deleteText}>
                STRINGSDelete
              </StyledButton>
          )}
        </PopupButtonWrapper>
        <br />
        ("Add to class" and "Delete" open popups.)
      </s.NarrowColumn>
    </Fragment>
  );
}
