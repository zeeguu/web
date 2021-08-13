import React, { useState, useContext, Fragment, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import strings from "../i18n/definitions";
import { RoutingContext } from "../contexts/RoutingContext";
import EditTextInputFields from "./EditTextInputFields";
import AddToCohortDialog from "./AddToCohortDialog";
import DeleteTextWarning from "./DeleteTextWarning";
import {
  StyledButton,
  TopButtonWrapper,
  PopupButtonWrapper,
} from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import * as scs from "./EditText.sc";
import {
  ShareWithClassesButton,
  ViewAsStudentButton,
} from "./TooltipedButtons";

export default function EditText({ api }) {
  const articleID = useParams().articleID;
  const isNew = articleID === "new";
  const [stateChanged, setStateChanged] = useState(false);

  const [state, setState] = useState({
    article_title: "",
    article_content: "",
    language_code: "default",
  });

  const inputInvalid =
    state.article_title === "" ||
    state.article_content === "" ||
    state.language_code === "default";

  const viewAsStudentAndShareDisabled = inputInvalid || stateChanged;
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteTextWarning, setShowDeleteTextWarning] = useState(false);

  //The user is editing an already existing text...
  useEffect(() => {
    if (!isNew) {
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

  //As there are three paths to EditText, we are using RoutingContext to go back correctly on Cancel
  const { returnPath } = useContext(RoutingContext);
  const history = useHistory();

  const handleCancel = () => {
    history.push(returnPath);
  };

  const handleChange = (event) => {
    setStateChanged(true);
    setState({
      ...state,
      [event.target.name]: event.target.value, //ie: article_title : "Harry Potter tickets sold out", article_content : "bla bla bla"
    });
  };

  //The LanguageSelector component returns the language selected by the user as a string (not an event like the other input fields)
  function handleLanguageChange(selectedLanguage) {
    setStateChanged(true);
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
        setStateChanged(false);
        history.push("/teacher/texts");
      }
    );
  };

  const updateArticle = () => {
    api.updateOwnText(
      articleID,
      state.article_title,
      state.article_content,
      state.language_code,
      (result) => {
        if ((result = "OK")) {
          setStateChanged(false);
          history.push("/teacher/texts");
        } else {
          console.log(result);
        }
      }
    );
  };

  const deleteText = () => {
    api.deleteOwnText(articleID, (res) => {
      if (res === "OK") {
        setStateChanged(false);
        history.push("/teacher/texts");
      } else {
        console.log(res);
      }
    });
  };

  return (
    <Fragment>
      <s.NarrowColumn>
        <scs.StyledEditText>
          <sc.TopTabs>
            <h1>{strings.editText}</h1>
          </sc.TopTabs>
          <TopButtonWrapper>
            <ViewAsStudentButton
              articleID={articleID}
              disabled={viewAsStudentAndShareDisabled}
              isNew={isNew}
            />
            <ShareWithClassesButton
              onclick={() => setShowDialog(true)}
              disabled={viewAsStudentAndShareDisabled}
              isNew={isNew}
            />
            <StyledButton secondary onClick={handleCancel}>
              {strings.cancel}
            </StyledButton>
          </TopButtonWrapper>
          <EditTextInputFields
            api={api}
            language_code={state.language_code}
            article_title={state.article_title}
            article_content={state.article_content}
            handleLanguageChange={handleLanguageChange}
            handleChange={handleChange}
          />
          {inputInvalid && (
            <p className="empty-string-warning">
              {strings.errorEmptyInputField}
            </p>
          )}
          <PopupButtonWrapper>
            {isNew ? (
              <StyledButton
                primary
                onClick={uploadArticle}
                disabled={inputInvalid}
              >
                {strings.saveText}
              </StyledButton>
            ) : (
              <Fragment>
                <StyledButton
                  secondary
                  onClick={() => setShowDeleteTextWarning(true)}
                >
                  {strings.delete}
                </StyledButton>
                <StyledButton
                  primary
                  onClick={updateArticle}
                  disabled={inputInvalid}
                >
                  {strings.saveChanges}
                </StyledButton>
              </Fragment>
            )}
          </PopupButtonWrapper>
        </scs.StyledEditText>
      </s.NarrowColumn>
      {showDialog && <AddToCohortDialog api={api} setIsOpen={setShowDialog} />}
      {showDeleteTextWarning && (
        <DeleteTextWarning
          deleteText={deleteText}
          setShowDeleteTextWarning={setShowDeleteTextWarning}
          articleTitle={state.article_title}
        />
      )}
    </Fragment>
  );
}
