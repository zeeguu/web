import React, { useState, useContext, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
//import strings from "../i18n/definitions";
import { UserContext } from "../UserContext";
import { RoutingContext } from "../contexts/RoutingContext";
import {LanguageSelector } from "./LanguageSelector";
import {
  LabeledTextField,
  LabeledMultiLineTextField,
} from "./LabeledInputFields";
import { StyledButton } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

export default function EditText({ api }) {
  //const languageCode = languageMap[cohortData.language_name];
  const user = useContext(UserContext);

  const [state, setState] = useState({
    article_title: "",
    article_content: "",
    language_code: "default",
  });

  //As there are two paths to EditTexts we are using RoutingContext to be able to go back on the right one on Cancel
  const { returnPath } = useContext(RoutingContext);
  const history = useHistory();

  const handleCancel = () => {
    history.push(returnPath);
  };

  const handleChange = (event) => {
    setState({
      ...state, //for all element in state do ...
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
  function saveText (event){
    event.preventDefault();
    console.log(state.article_title)
    console.log(state.article_content)
    console.log(state.language_code)
  }
  /* 
  const submitArticle = (e) => {
    e.preventDefault();
    let articleObj = createArticleObject(
      state.article_title,
      state.article_content,
      state.language_code,
      user
    );
    uploadArticles(cohortData.id, [articleObj]).then((result) => {
      setForceRerender((prev) => prev + 1);
    });
    setState({
      article_title: "",
      article_content: "",
      language_code: "",
    });
  }; */

  return (
    <Fragment>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>STRINGSEditText</h1>
        </sc.TopTabs>
        <StyledButton primary onClick={saveText}>STRINGSAdd to class</StyledButton>
        <Link to="/teacher/texts/editText/:articleID/studentView">
          <StyledButton secondary>STRINGSView as student</StyledButton>
        </Link>
        <StyledButton secondary>STRINGSDelete</StyledButton>
        <StyledButton secondary onClick={handleCancel}>
          STRINGSCancel
        </StyledButton>
        <br />
        <br />
        <LanguageSelector
          value={state.language_code}
          onChange={handleLanguageChange}
        >
          Please, define the language of the text STRINGS
        </LanguageSelector>
        <LabeledTextField
          value={state.article_title}
          onChange={handleChange}
          name="article_title"
          placeholder="STRINGSPaste or type your title here..."
        >
          STRINGSClick in the box below to edit the title
        </LabeledTextField>
        <br />
        <br />
        <LabeledMultiLineTextField
          value={state.article_content}
          onChange={handleChange}
          name="article_content"
          placeholder="STRINGSPaste or type the body of your text here..."
        >
          STRINGSClick in the box below to edit the text body
        </LabeledMultiLineTextField>
        <br />
        <br />
        <br />
        ("Add to class" and "Delete" open popups.)
      </s.NarrowColumn>
    </Fragment>
  );
}
