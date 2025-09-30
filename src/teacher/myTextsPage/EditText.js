import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import strings from "../../i18n/definitions";
import { RoutingContext } from "../../contexts/RoutingContext";
import EditTextInputFields from "./EditTextInputFields";
import AddToCohortDialog from "./AddToCohortDialog";
import DeleteTextWarning from "./DeleteTextWarning";
import { StyledButton, TopButtonWrapper } from "../styledComponents/TeacherButtons.sc";
import * as s from "../../components/ColumnWidth.sc";
import { ShareWithClassesButton, ViewAsStudentButton } from "./TooltippedButtons";
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
  const [cohortList, setCohortList] = useState([]);
  const [showAddToCohortDialog, setShowAddToCohortDialog] = useState(false);
  const [showDeleteTextWarning, setShowDeleteTextWarning] = useState(false);
  const [showShareWithColleagueDialog, setShowShareWithColleagueDialog] = useState(false);

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
      api.getCohortFromArticle(articleID, (cohorts) => {
        setCohortList(cohorts || []);
      });
    }
    //eslint-disable-next-line
  }, [articleID]);

  //As there are three paths to EditText, we are using RoutingContext to go back correctly on Cancel
  const { returnPath } = useContext(RoutingContext);
  const history = useHistory();

  const handleCancel = () => {
    if (!isNew) {
      api.getArticleInfo(articleID, (article) => {
        setArticleState({
          article_title: article.title || "",
          article_content: article.htmlContent || article.content || "",
          language_code: article.language || "default",
        });
        setStateChanged(false);
      });
      api.getCohortFromArticle(articleID, (cohorts) => {
        setCohortList(cohorts || []);
      });
    } else {
      history.push(returnPath);
    }
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
      articleState.article_content, // HTML content
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
        } else {
          console.log(result);
        }
      },
      articleState.article_content, // HTML content
    );
  };

  const handleBack = () => {
    history.push("/teacher/texts");
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
        <TopButtonWrapper style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {!isNew && (
              <StyledButton secondary onClick={() => setShowDeleteTextWarning(true)}>
                {strings.delete}
              </StyledButton>
            )}
            <ViewAsStudentButton articleID={articleID} disabled={viewAsStudentAndShareDisabled} isNew={isNew} />
            <StyledButton
              secondary
              onClick={() => setShowShareWithColleagueDialog(true)}
              disabled={viewAsStudentAndShareDisabled}
            >
              {strings.shareWithColleague}
            </StyledButton>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {stateChanged && (
              <>
                <StyledButton secondary onClick={handleCancel}>
                  {strings.cancel}
                </StyledButton>
                <StyledButton primary onClick={isNew ? uploadArticle : updateArticle} disabled={inputInvalid}>
                  {strings.save}
                </StyledButton>
              </>
            )}
            {!stateChanged && (
              <StyledButton primary onClick={handleBack}>
                Close
              </StyledButton>
            )}
          </div>
        </TopButtonWrapper>
        <div
          style={{
            marginTop: "1.5rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            backgroundColor: "#f8f9fa",
            padding: "0.75rem",
            borderRadius: "5px",
          }}
        >
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Share With:</span>
          {cohortList.map((cohort, index) => (
            <span
              key={cohort}
              style={{ whiteSpace: "nowrap", fontFamily: "monospace", fontSize: "1.05em", letterSpacing: "-0.5px" }}
            >
              {cohort}
              {index < cohortList.length - 1 ? "," : ""}
            </span>
          ))}
          <div style={{ flexShrink: 0 }}>
            <ShareWithClassesButton
              onclick={() => setShowAddToCohortDialog(true)}
              disabled={viewAsStudentAndShareDisabled}
              isNew={isNew}
            />
          </div>
        </div>
        <EditTextInputFields
          language_code={articleState.language_code}
          article_title={articleState.article_title}
          article_content={articleState.article_content}
          handleLanguageChange={handleLanguageChange}
          handleChange={handleChange}
        />
        {inputInvalid && <Error message={strings.errorEmptyInputField} />}
        <div style={{ height: "8em" }} />
      </s.NarrowColumn>
      {showAddToCohortDialog && (
        <AddToCohortDialog
          setIsOpen={setShowAddToCohortDialog}
          onCohortsUpdated={(cohorts) => setCohortList(cohorts)}
        />
      )}
      {showDeleteTextWarning && (
        <DeleteTextWarning
          deleteText={deleteText}
          setShowDeleteTextWarning={setShowDeleteTextWarning}
          articleTitle={articleState.article_title}
        />
      )}
      {showShareWithColleagueDialog && (
        <ShareWithCollegueDialog articleID={articleID} setShowDialog={setShowShareWithColleagueDialog} />
      )}
    </Fragment>
  );
}
