import React, { useState, useContext, Fragment, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import strings from "../../i18n/definitions";
import { RoutingContext } from "../../contexts/RoutingContext";
import EditTextInputFields from "./EditTextInputFields";
import AddToCohortDialog from "./AddToCohortDialog";
import DeleteTextWarning from "./DeleteTextWarning";
import {
  StyledButton,
  TopButtonWrapper,
  PopupButtonWrapper,
} from "../styledComponents/TeacherButtons.sc";
import * as s from "../../components/ColumnWidth.sc";
import * as sc from "../../components/TopTabs.sc";
import {
  ShareWithClassesButton,
  ViewAsStudentButton,
} from "./TooltippedButtons";
import { Error } from "../sharedComponents/Error";
import ShareWithCollegueDialog from "./ShareWithColleagueDialog";
import { APIContext } from "../../contexts/APIContext";

export default function EditText() {
  const api = useContext(APIContext);
  const [articleState, setArticleState] = useState({
    article_title: "",
    article_content: "",
    language_code: "default",
  });
  const [showAddToCohortDialog, setShowAddToCohortDialog] = useState(false);
  const [showDeleteTextWarning, setShowDeleteTextWarning] = useState(false);
  const [showShareWithColleagueDialog, setShowShareWithColleagueDialog] =
    useState(false);

  const [stateChanged, setStateChanged] = useState(false);
  const articleID = useParams().articleID;
  const isNew = articleID === "new";
  const inputInvalid =
    articleState.article_title === "" ||
    articleState.article_content === "" ||
    articleState.language_code === "default";

  const viewAsStudentAndShareDisabled = inputInvalid || stateChanged;

  //The user is editing an already existing text...
  useEffect(() => {
    if (!isNew) {
      api.getArticleInfo(articleID, (article) => {
        setArticleState({
          article_title: article.title || "",
          article_content: article.htmlContent || article.content || "",
          language_code: article.language || "default",
        });
        setStateChanged(false);
      });
    }
    //eslint-disable-next-line
  }, [articleID]);

  //As there are three paths to EditText, we are using RoutingContext to go back correctly on Cancel
  const { returnPath } = useContext(RoutingContext);
  const history = useHistory();

  const handleCancel = () => {
    history.push(returnPath);
  };

  const handleChange = (event) => {
    setStateChanged(true);
    setArticleState({
      ...articleState,
      [event.target.name]: event.target.value, //ie: article_title : "Harry Potter tickets sold out", article_content : "bla bla bla"
    });
  };

  //The LanguageSelector component returns the language selected by the user as a string (not an event like the other input fields)
  function handleLanguageChange(selectedLanguage) {
    setStateChanged(true);
    setArticleState({
      ...articleState,
      language_code: selectedLanguage,
    });
  }

  const uploadArticle = () => {
    // Strip HTML tags to get plain text for content field
    const stripHtml = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    console.log("Saving HTML content:", articleState.article_content);

    api.uploadOwnText(
      articleState.article_title,
      stripHtml(articleState.article_content), // Plain text
      articleState.language_code,
      (newID) => {
        console.log(`article created with id: ${newID}`);
        setStateChanged(false);
        // Navigate to the edit page for the newly created article
        history.push(`/teacher/texts/editText/${newID}`);
      },
      null, // onError
      null, // original_cefr_level
      null, // img_url
      articleState.article_content // HTML content
    );
  };

  const updateArticle = () => {
    // Strip HTML tags to get plain text for content field
    const stripHtml = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    console.log("Updating HTML content:", articleState.article_content);

    api.updateOwnText(
      articleID,
      articleState.article_title,
      stripHtml(articleState.article_content), // Plain text
      articleState.language_code,
      (result) => {
        if ((result = "OK")) {
          setStateChanged(false);
          history.push("/teacher/texts");
        } else {
          console.log(result);
        }
      },
      articleState.article_content // HTML content
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
        <sc.TopTabs>
          <h1>{strings.editText}</h1>
        </sc.TopTabs>
        <TopButtonWrapper>
          <ViewAsStudentButton
            articleID={articleID}
            disabled={viewAsStudentAndShareDisabled}
            isNew={isNew}
          />
          <StyledButton
            secondary
            onClick={() => setShowShareWithColleagueDialog(true)}
            disabled={viewAsStudentAndShareDisabled}
          >
            {strings.shareWithColleague}
          </StyledButton>
          <ShareWithClassesButton
            onclick={() => setShowAddToCohortDialog(true)}
            disabled={viewAsStudentAndShareDisabled}
            isNew={isNew}
          />
        </TopButtonWrapper>
        <EditTextInputFields
          language_code={articleState.language_code}
          article_title={articleState.article_title}
          article_content={articleState.article_content}
          handleLanguageChange={handleLanguageChange}
          handleChange={handleChange}
        />
        {inputInvalid && <Error message={strings.errorEmptyInputField} />}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {!isNew && (
            <StyledButton
              secondary
              onClick={() => setShowDeleteTextWarning(true)}
            >
              {strings.delete}
            </StyledButton>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
            <StyledButton secondary onClick={handleCancel}>
              {strings.cancel}
            </StyledButton>
            <StyledButton
              primary
              onClick={isNew ? uploadArticle : updateArticle}
              disabled={inputInvalid}
            >
              {strings.save}
            </StyledButton>
          </div>
        </div>
        <div style={{ height: '8em' }} />
      </s.NarrowColumn>
      {showAddToCohortDialog && (
        <AddToCohortDialog setIsOpen={setShowAddToCohortDialog} />
      )}
      {showDeleteTextWarning && (
        <DeleteTextWarning
          deleteText={deleteText}
          setShowDeleteTextWarning={setShowDeleteTextWarning}
          articleTitle={articleState.article_title}
        />
      )}
      {showShareWithColleagueDialog && (
        <ShareWithCollegueDialog
          articleID={articleID}
          setShowDialog={setShowShareWithColleagueDialog}
        />
      )}
    </Fragment>
  );
}
